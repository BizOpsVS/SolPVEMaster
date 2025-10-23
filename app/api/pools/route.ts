import { NextRequest, NextResponse } from 'next/server'
import { 
  createPool, 
  isPoolOpenForStakes, 
  validateStake, 
  resolvePool, 
  calculateSettlements,
  poolToCard,
  getEffectivePoolStatus
} from '@/lib/pool-management'
import { snapshotPriceWithRetry } from '@/lib/oracle-service'
import type { PoolListItem, Stake, Duration } from '@/types/pve'

// Mock database - in production, use Prisma or your preferred ORM
let pools: PoolListItem[] = []
let stakes: Stake[] = []

/**
 * GET /api/pools - List pools with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const duration = searchParams.get('duration') as Duration | null
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let filteredPools = pools
    
    // Filter by status
    if (status) {
      filteredPools = filteredPools.filter(pool => {
        const effectiveStatus = getEffectivePoolStatus(pool)
        return effectiveStatus === status
      })
    }
    
    // Filter by duration
    if (duration) {
      filteredPools = filteredPools.filter(pool => pool.duration === duration)
    }
    
    // Sort by start time (newest first)
    filteredPools.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    
    // Paginate
    const paginatedPools = filteredPools.slice(offset, offset + limit)
    
    // Convert to cards for UI
    const poolCards = paginatedPools.map(poolToCard)
    
    return NextResponse.json({
      pools: poolCards,
      total: filteredPools.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Failed to fetch pools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pools' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pools - Create a new pool
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { asset_id, asset_symbol, duration, ai_line } = body
    
    // Validate required fields
    if (!asset_id || !asset_symbol || !duration || !ai_line) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create pool
    const poolData = createPool(asset_id, asset_symbol, duration, ai_line)
    const pool: PoolListItem = {
      id: `pool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...poolData
    }
    
    pools.push(pool)
    
    return NextResponse.json(poolToCard(pool), { status: 201 })
  } catch (error) {
    console.error('Failed to create pool:', error)
    return NextResponse.json(
      { error: 'Failed to create pool' },
      { status: 500 }
    )
  }
}
