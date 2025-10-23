import { NextResponse } from 'next/server'
import { fetchTrendingTokens, fetchSolanaTokens } from '@/lib/coingecko-service'

export async function GET() {
  try {
    const [trendingTokens, solanaTokens] = await Promise.all([
      fetchTrendingTokens(),
      fetchSolanaTokens()
    ])

    return NextResponse.json({
      trending: trendingTokens,
      solana: solanaTokens,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch CoinGecko data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending tokens' },
      { status: 500 }
    )
  }
}
