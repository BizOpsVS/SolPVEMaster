import { NextRequest, NextResponse } from 'next/server'
import { 
  isPoolOpenForStakes, 
  validateStake, 
  resolvePool, 
  calculateSettlements,
  getEffectivePoolStatus
} from '@/lib/pool-management'
import { snapshotPriceWithRetry } from '@/lib/oracle-service'
import type { Stake } from '@/types/pve'

// Mock database - in production, use Prisma
let pools: any[] = []
let stakes: Stake[] = []

/**
 * GET /api/pools/[id] - Get specific pool details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = pools.find(p => p.id === params.id)
    
    if (!pool) {
      return NextResponse.json(
        { error: 'Pool not found' },
        { status: 404 }
      )
    }
    
    // Get pool stakes
    const poolStakes = stakes.filter(s => s.pool_id === params.id)
    
    return NextResponse.json({
      ...pool,
      stakes: poolStakes
    })
  } catch (error) {
    console.error('Failed to fetch pool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pool' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pools/[id]/stake - Place a stake
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { side, amount, user_id } = body
    
    // Validate required fields
    if (!side || !amount || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields: side, amount, user_id' },
        { status: 400 }
      )
    }
    
    // Find pool
    const pool = pools.find(p => p.id === params.id)
    if (!pool) {
      return NextResponse.json(
        { error: 'Pool not found' },
        { status: 404 }
      )
    }
    
    // Check if pool is open for stakes
    if (!isPoolOpenForStakes(pool)) {
      return NextResponse.json(
        { error: 'Pool is not open for new stakes' },
        { status: 400 }
      )
    }
    
    // Get user's existing stake on this side
    const existingStake = stakes
      .filter(s => s.pool_id === params.id && s.user_id === user_id && s.side === side && s.status === 'ACTIVE')
      .reduce((sum, s) => sum + s.amount, 0)
    
    // Validate stake
    const validation = validateStake(pool, amount, existingStake)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    // Create stake
    const stake: Stake = {
      id: `stk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pool_id: params.id,
      user_id,
      side,
      amount,
      created_at: new Date().toISOString(),
      status: 'ACTIVE'
    }
    
    stakes.push(stake)
    
    // Update pool pots
    if (side === 'OVER') {
      pool.pots.over += amount
    } else {
      pool.pots.under += amount
    }
    
    return NextResponse.json(stake, { status: 201 })
  } catch (error) {
    console.error('Failed to place stake:', error)
    return NextResponse.json(
      { error: 'Failed to place stake' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pools/[id]/resolve - Resolve pool (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = pools.find(p => p.id === params.id)
    
    if (!pool) {
      return NextResponse.json(
        { error: 'Pool not found' },
        { status: 404 }
      )
    }
    
    // Check if pool is ready for resolution
    const now = new Date()
    const resolveAt = new Date(pool.resolve_at)
    
    if (now < resolveAt) {
      return NextResponse.json(
        { error: 'Pool is not ready for resolution yet' },
        { status: 400 }
      )
    }
    
    if (pool.status !== 'LOCKED') {
      return NextResponse.json(
        { error: 'Pool is not in LOCKED status' },
        { status: 400 }
      )
    }
    
    // Get price snapshots
    let entryPrice: number
    let exitPrice: number
    
    if (pool.snapshots?.entry && pool.snapshots?.exit) {
      // Use existing snapshots
      entryPrice = pool.snapshots.entry.price
      exitPrice = pool.snapshots.exit.price
    } else {
      // Take new snapshots (in production, these would be taken at lock/resolve times)
      try {
        const entrySnapshot = await snapshotPriceWithRetry(pool.asset_id)
        const exitSnapshot = await snapshotPriceWithRetry(pool.asset_id)
        
        entryPrice = entrySnapshot.price
        exitPrice = exitSnapshot.price
        
        // Store snapshots
        pool.snapshots = {
          entry: entrySnapshot,
          exit: exitSnapshot
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to get price snapshots' },
          { status: 500 }
        )
      }
    }
    
    // Resolve pool
    const result = resolvePool(entryPrice, exitPrice, pool.ai.line_bps)
    
    // Calculate settlements
    const poolStakes = stakes.filter(s => s.pool_id === params.id && s.status === 'ACTIVE')
    const settlements = calculateSettlements(pool, poolStakes, result)
    
    // Update pool
    pool.status = 'RESOLVED'
    pool.result = result
    
    return NextResponse.json({
      pool,
      result,
      settlements
    })
  } catch (error) {
    console.error('Failed to resolve pool:', error)
    return NextResponse.json(
      { error: 'Failed to resolve pool' },
      { status: 500 }
    )
  }
}
