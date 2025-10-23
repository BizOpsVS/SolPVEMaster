/**
 * DexScreener API Service
 * https://api.dexscreener.com/token-profiles/latest/v1
 */

export interface DexScreenerToken {
  url: string
  chainId: string
  tokenAddress: string
  icon: string
  header: string
  openGraph: string
  description?: string
  links?: Array<{
    type: string
    url: string
    label?: string
  }>
  cto: boolean
}

export interface DexScreenerResponse {
  data: DexScreenerToken[]
}

/**
 * Fetch latest token profiles from DexScreener
 */
export async function fetchLatestTokenProfiles(): Promise<DexScreenerToken[]> {
  try {
    const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1')
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch token profiles from DexScreener:', error)
    return []
  }
}

/**
 * Fetch token profile by address
 */
export async function fetchTokenProfile(address: string): Promise<DexScreenerToken | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0]
      return {
        url: `https://dexscreener.com/solana/${address}`,
        chainId: 'solana',
        tokenAddress: address,
        icon: pair.baseToken.image,
        header: pair.baseToken.image,
        openGraph: pair.baseToken.image,
        description: pair.baseToken.name,
        cto: false
      }
    }
    
    return null
  } catch (error) {
    console.error(`Failed to fetch token profile for ${address}:`, error)
    return null
  }
}

/**
 * Search tokens by query
 */
export async function searchTokens(query: string): Promise<DexScreenerToken[]> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.pairs) {
      return data.pairs.map((pair: any) => ({
        url: `https://dexscreener.com/solana/${pair.pairAddress}`,
        chainId: 'solana',
        tokenAddress: pair.baseToken.address,
        icon: pair.baseToken.image,
        header: pair.baseToken.image,
        openGraph: pair.baseToken.image,
        description: pair.baseToken.name,
        cto: false
      }))
    }
    
    return []
  } catch (error) {
    console.error(`Failed to search tokens for "${query}":`, error)
    return []
  }
}

/**
 * Get trending Solana tokens from DexScreener
 */
export async function fetchTrendingSolanaTokens(): Promise<DexScreenerToken[]> {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana')
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.pairs) {
      // Filter for tokens with good volume and recent activity
      const trendingPairs = data.pairs
        .filter((pair: any) => 
          pair.volume && 
          pair.volume.h24 > 10000 && // At least $10k volume
          pair.priceUsd && 
          pair.priceUsd > 0
        )
        .sort((a: any, b: any) => b.volume.h24 - a.volume.h24)
        .slice(0, 20) // Top 20

      return trendingPairs.map((pair: any) => ({
        url: `https://dexscreener.com/solana/${pair.pairAddress}`,
        chainId: 'solana',
        tokenAddress: pair.baseToken.address,
        icon: pair.baseToken.image,
        header: pair.baseToken.image,
        openGraph: pair.baseToken.image,
        description: pair.baseToken.name,
        cto: false
      }))
    }
    
    return []
  } catch (error) {
    console.error('Failed to fetch trending Solana tokens from DexScreener:', error)
    return []
  }
}
