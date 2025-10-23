/**
 * CoinGecko API Service
 * https://docs.coingecko.com/docs/setting-up-your-api-key
 */

export interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null | {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string
}

export interface CoinGeckoResponse {
  data: CoinGeckoToken[]
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
    notice: string | null
  }
}

/**
 * Fetch trending tokens from CoinGecko
 */
export async function fetchTrendingTokens(): Promise<CoinGeckoToken[]> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }
    
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey
    }

    const response = await fetch(
      'https://api.coingecko.com/api/v3/search/trending',
      { headers }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.coins.map((coin: any) => coin.item)
  } catch (error) {
    console.error('Failed to fetch trending tokens from CoinGecko:', error)
    return []
  }
}

/**
 * Fetch token details by ID
 */
export async function fetchTokenById(id: string): Promise<CoinGeckoToken | null> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }
    
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch token ${id} from CoinGecko:`, error)
    return null
  }
}

/**
 * Fetch multiple tokens by IDs
 */
export async function fetchTokensByIds(ids: string[]): Promise<CoinGeckoToken[]> {
  try {
    const apiKey = process.env.COINGECKO_API_KEY
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }
    
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey
    }

    const idsParam = ids.join(',')
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch tokens from CoinGecko:', error)
    return []
  }
}

/**
 * Get popular Solana tokens
 */
export async function fetchSolanaTokens(): Promise<CoinGeckoToken[]> {
  const solanaTokenIds = [
    'solana',
    'bonk',
    'dogwifhat',
    'pepe',
    'book-of-meme',
    'myro',
    'popcat',
    'cat-in-a-dogs-world',
    'mew',
    'bome'
  ]

  return fetchTokensByIds(solanaTokenIds)
}
