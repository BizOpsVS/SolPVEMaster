import { NextResponse } from 'next/server'
import { fetchLatestTokenProfiles, fetchTrendingSolanaTokens } from '@/lib/dexscreener-service'

export async function GET() {
  try {
    const [latestProfiles, trendingSolana] = await Promise.all([
      fetchLatestTokenProfiles(),
      fetchTrendingSolanaTokens()
    ])

    return NextResponse.json({
      latest: latestProfiles,
      trendingSolana: trendingSolana,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch DexScreener data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token profiles' },
      { status: 500 }
    )
  }
}
