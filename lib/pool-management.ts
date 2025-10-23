/**
 * Pool Management Service
 * Implements pool lifecycle, stake management, and payout calculations
 */

import type { 
  PoolListItem, 
  PoolCard, 
  Stake, 
  Settlement, 
  Side, 
  Status, 
  Duration,
  PoolResult,
  PoolPots
} from '@/types/pve'
import { snapshotPriceWithRetry } from './oracle-service'

export interface PoolConfig {
  enrollWindowRatio: number
  enrollWindowMaxMs: number
  platformFeePct: number
  minStake: number
  maxStakePct: number
  snapshotEpsilon: number
}

const DEFAULT_CONFIG: PoolConfig = {
  enrollWindowRatio: 0.4,
  enrollWindowMaxMs: 600000, // 10 minutes
  platformFeePct: 0.02,
  minStake: 1,
  maxStakePct: 0.2,
  snapshotEpsilon: 0.000001
}

/**
 * Duration presets in milliseconds
 */
const DURATION_MS: Record<Duration, number> = {
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000
}

/**
 * Calculate pool timing based on business rules
 */
export function calculatePoolTiming(
  duration: Duration,
  startAt: Date,
  config: Partial<PoolConfig> = {}
): { lockAt: Date; resolveAt: Date } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const durationMs = DURATION_MS[duration]
  
  // Enroll window = 40% of duration, capped at 10 minutes
  const enrollWindowMs = Math.min(
    durationMs * finalConfig.enrollWindowRatio,
    finalConfig.enrollWindowMaxMs
  )
  
  const lockAt = new Date(startAt.getTime() + enrollWindowMs)
  const resolveAt = new Date(startAt.getTime() + durationMs)
  
  return { lockAt, resolveAt }
}

/**
 * Check if pool is open for new stakes
 */
export function isPoolOpenForStakes(pool: PoolListItem): boolean {
  const now = new Date()
  const lockAt = new Date(pool.lock_at)
  return pool.status === 'OPEN' && now < lockAt
}

/**
 * Check if pool is locked (no new stakes, waiting for resolution)
 */
export function isPoolLocked(pool: PoolListItem): boolean {
  const now = new Date()
  const lockAt = new Date(pool.lock_at)
  const resolveAt = new Date(pool.resolve_at)
  return pool.status === 'LOCKED' || (now >= lockAt && now < resolveAt)
}

/**
 * Check if pool is ready for resolution
 */
export function isPoolReadyForResolution(pool: PoolListItem): boolean {
  const now = new Date()
  const resolveAt = new Date(pool.resolve_at)
  return pool.status === 'LOCKED' && now >= resolveAt
}

/**
 * Validate stake amount against pool rules
 */
export function validateStake(
  pool: PoolListItem,
  stakeAmount: number,
  userExistingStake: number = 0,
  config: Partial<PoolConfig> = {}
): { valid: boolean; error?: string } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Check minimum stake
  if (stakeAmount < finalConfig.minStake) {
    return { valid: false, error: `Minimum stake is ${finalConfig.minStake}` }
  }
  
  // Check maximum stake percentage
  const totalStake = userExistingStake + stakeAmount
  const potTotal = pool.pots.over + pool.pots.under
  const maxAllowed = potTotal * finalConfig.maxStakePct
  
  if (totalStake > maxAllowed) {
    return { 
      valid: false, 
      error: `Maximum stake is ${finalConfig.maxStakePct * 100}% of pot (${maxAllowed.toFixed(2)})` 
    }
  }
  
  return { valid: true }
}

/**
 * Calculate proportional payout for winners
 */
export function calculatePayout(
  userStake: number,
  winnerPot: number,
  loserPot: number,
  platformFeePct: number = 0.02
): { payout: number; feeApplied: number } {
  if (winnerPot === 0) {
    return { payout: 0, feeApplied: 0 }
  }
  
  // Calculate user's share of the winning pot
  const userShare = userStake / winnerPot
  
  // Apply platform fee to losing pot
  const loserPotAfterFee = loserPot * (1 - platformFeePct)
  const feeApplied = loserPot * platformFeePct
  
  // User gets their stake back + proportional share of losing pot
  const payout = userStake + (userShare * loserPotAfterFee)
  
  return { payout, feeApplied }
}

/**
 * Resolve pool based on price movement vs AI line
 */
export function resolvePool(
  entryPrice: number,
  exitPrice: number,
  aiLineBps: number,
  epsilon: number = 0.000001
): PoolResult {
  // Calculate return percentage
  const retPct = ((exitPrice - entryPrice) / entryPrice) * 100
  const linePct = aiLineBps / 100
  
  // Check for tie (within epsilon tolerance)
  const diff = Math.abs(retPct - linePct)
  if (diff <= epsilon) {
    return {
      ret_pct: retPct,
      line_pct: linePct,
      winner: 'TIE',
      fee_pct: 0
    }
  }
  
  // Determine winner
  const winner: Side = retPct > linePct ? 'OVER' : 'UNDER'
  
  return {
    ret_pct: retPct,
    line_pct: linePct,
    winner,
    fee_pct: DEFAULT_CONFIG.platformFeePct
  }
}

/**
 * Calculate settlements for all users in a pool
 */
export function calculateSettlements(
  pool: PoolListItem,
  stakes: Stake[],
  result: PoolResult
): Settlement[] {
  const settlements: Settlement[] = []
  
  if (result.winner === 'TIE') {
    // Refund all stakes
    stakes.forEach(stake => {
      settlements.push({
        id: `set_${stake.id}`,
        pool_id: pool.id,
        user_id: stake.user_id,
        side: stake.side,
        stake: stake.amount,
        payout: stake.amount, // Full refund
        fee_applied: 0,
        tx_ref: null
      })
    })
    return settlements
  }
  
  // Group stakes by side
  const overStakes = stakes.filter(s => s.side === 'OVER' && s.status === 'ACTIVE')
  const underStakes = stakes.filter(s => s.side === 'UNDER' && s.status === 'ACTIVE')
  
  const winnerStakes = result.winner === 'OVER' ? overStakes : underStakes
  const loserStakes = result.winner === 'OVER' ? underStakes : overStakes
  
  const winnerPot = winnerStakes.reduce((sum, s) => sum + s.amount, 0)
  const loserPot = loserStakes.reduce((sum, s) => sum + s.amount, 0)
  
  // Calculate settlements for winners
  winnerStakes.forEach(stake => {
    const { payout, feeApplied } = calculatePayout(
      stake.amount,
      winnerPot,
      loserPot,
      result.fee_pct
    )
    
    settlements.push({
      id: `set_${stake.id}`,
      pool_id: pool.id,
      user_id: stake.user_id,
      side: stake.side,
      stake: stake.amount,
      payout,
      fee_applied: feeApplied,
      tx_ref: null
    })
  })
  
  // Losers get nothing (their stakes go to winners)
  loserStakes.forEach(stake => {
    settlements.push({
      id: `set_${stake.id}`,
      pool_id: pool.id,
      user_id: stake.user_id,
      side: stake.side,
      stake: stake.amount,
      payout: 0,
      fee_applied: 0,
      tx_ref: null
    })
  })
  
  return settlements
}

/**
 * Convert PoolListItem to PoolCard for UI display
 */
export function poolToCard(pool: PoolListItem): PoolCard {
  const potTotal = pool.pots.over + pool.pots.under
  const overPct = potTotal > 0 ? (pool.pots.over / potTotal) * 100 : 0
  const underPct = potTotal > 0 ? (pool.pots.under / potTotal) * 100 : 0
  
  return {
    id: pool.id,
    asset_symbol: pool.asset_symbol,
    duration: pool.duration,
    status: pool.status,
    lock_at: pool.lock_at,
    resolve_at: pool.resolve_at,
    ai_line_pct: pool.ai.line_bps / 100,
    confidence_pct: pool.ai.confidence_pct,
    over_pct: overPct,
    under_pct: underPct
  }
}

/**
 * Get pool status based on current time
 */
export function getEffectivePoolStatus(pool: PoolListItem): Status {
  const now = new Date()
  const lockAt = new Date(pool.lock_at)
  const resolveAt = new Date(pool.resolve_at)
  
  if (pool.status === 'SETTLED' || pool.status === 'ADMIN_REVIEW' || pool.status === 'REFUND') {
    return pool.status
  }
  
  if (now < lockAt) {
    return 'OPEN'
  } else if (now < resolveAt) {
    return 'LOCKED'
  } else {
    return 'RESOLVED'
  }
}

/**
 * Create a new pool with proper timing
 */
export function createPool(
  assetId: string,
  assetSymbol: string,
  duration: Duration,
  aiLine: { line_bps: number; confidence_pct: number; model_version: string; commit: string },
  startAt?: Date
): Omit<PoolListItem, 'id'> {
  const start = startAt || new Date()
  const { lockAt, resolveAt } = calculatePoolTiming(duration, start)
  
  return {
    asset_id: assetId,
    asset_symbol: assetSymbol,
    currency: 'USD',
    duration,
    ai: {
      ...aiLine,
      generated_at: new Date().toISOString()
    },
    start_at: start.toISOString(),
    lock_at: lockAt.toISOString(),
    resolve_at: resolveAt.toISOString(),
    status: 'OPEN',
    pots: {
      over: 0,
      under: 0
    }
  }
}
