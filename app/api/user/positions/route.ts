import { NextRequest, NextResponse } from 'next/server'
import type { Stake, Settlement } from '@/types/pve'

// Mock database - in production, use Prisma
let stakes: Stake[] = []
let settlements: Settlement[] = []

/**
 * GET /api/user/positions - Get user's active and resolved positions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      )
    }
    
    // Get user's active stakes
    const activeStakes = stakes.filter(s => s.user_id === userId && s.status === 'ACTIVE')
    
    // Get user's settlements
    const userSettlements = settlements.filter(s => s.user_id === userId)
    
    // Calculate summary stats
    const totalStaked = activeStakes.reduce((sum, s) => sum + s.amount, 0)
    const totalPayouts = userSettlements.reduce((sum, s) => sum + s.payout, 0)
    const totalFees = userSettlements.reduce((sum, s) => sum + s.fee_applied, 0)
    const netProfit = totalPayouts - userSettlements.reduce((sum, s) => sum + s.stake, 0)
    
    return NextResponse.json({
      user_id: userId,
      active_stakes: activeStakes,
      settlements: userSettlements,
      summary: {
        total_staked: totalStaked,
        total_payouts: totalPayouts,
        total_fees: totalFees,
        net_profit: netProfit,
        active_positions: activeStakes.length,
        resolved_positions: userSettlements.length
      }
    })
  } catch (error) {
    console.error('Failed to fetch user positions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user positions' },
      { status: 500 }
    )
  }
}
