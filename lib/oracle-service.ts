/**
 * Oracle Service - Multi-source price fetching with fallbacks
 * Implements the business rules for robust price snapshots
 */

import type { OracleTrace, PriceSnapshot } from '@/types/pve'

export interface OracleConfig {
  timeoutMs: number
  retries: number
  graceMs: number
  pauseLimitMs: number
  epsilon: number
}

const DEFAULT_CONFIG: OracleConfig = {
  timeoutMs: 2500,
  retries: 3,
  graceMs: 30000,
  pauseLimitMs: 180000,
  epsilon: 0.000001
}

export interface OracleResult {
  price: number
  sources: OracleTrace[]
  ok: boolean
  error?: string
}

/**
 * CoinGecko API - Free tier, no key required
 */
async function fetchCoingecko(assetId: string): Promise<OracleResult> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${assetId}&vs_currencies=usd`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeoutMs)
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    const price = data[assetId]?.usd
    
    if (!price || price <= 0) {
      throw new Error('Invalid price from CoinGecko')
    }
    
    return {
      price,
      sources: [{
        src: 'coingecko',
        price,
        ts: new Date().toISOString(),
        ok: true
      }],
      ok: true
    }
  } catch (error) {
    return {
      price: 0,
      sources: [{
        src: 'coingecko',
        price: 0,
        ts: new Date().toISOString(),
        ok: false
      }],
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * CoinCap API - Free tier
 */
async function fetchCoincap(assetId: string): Promise<OracleResult> {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${assetId}`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeoutMs)
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    const price = parseFloat(data.data?.priceUsd)
    
    if (!price || price <= 0) {
      throw new Error('Invalid price from CoinCap')
    }
    
    return {
      price,
      sources: [{
        src: 'coincap',
        price,
        ts: new Date().toISOString(),
        ok: true
      }],
      ok: true
    }
  } catch (error) {
    return {
      price: 0,
      sources: [{
        src: 'coincap',
        price: 0,
        ts: new Date().toISOString(),
        ok: false
      }],
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * CoinPaprika API - Free tier
 */
async function fetchPaprika(assetId: string): Promise<OracleResult> {
  try {
    const response = await fetch(
      `https://api.coinpaprika.com/v1/tickers/${assetId}`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeoutMs)
      }
    )
    
    if (!response.ok) {
      throw new Error(`CoinPaprika API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    const price = parseFloat(data.quotes?.USD?.price)
    
    if (!price || price <= 0) {
      throw new Error('Invalid price from CoinPaprika')
    }
    
    return {
      price,
      sources: [{
        src: 'paprika',
        price,
        ts: new Date().toISOString(),
        ok: true
      }],
      ok: true
    }
  } catch (error) {
    return {
      price: 0,
      sources: [{
        src: 'paprika',
        price: 0,
        ts: new Date().toISOString(),
        ok: false
      }],
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Binance Public API - No key required
 */
async function fetchBinance(symbol: string): Promise<OracleResult> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeoutMs)
      }
    )
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    const price = parseFloat(data.price)
    
    if (!price || price <= 0) {
      throw new Error('Invalid price from Binance')
    }
    
    return {
      price,
      sources: [{
        src: 'binance',
        price,
        ts: new Date().toISOString(),
        ok: true
      }],
      ok: true
    }
  } catch (error) {
    return {
      price: 0,
      sources: [{
        src: 'binance',
        price: 0,
        ts: new Date().toISOString(),
        ok: false
      }],
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Kraken Public API - No key required
 */
async function fetchKraken(pair: string): Promise<OracleResult> {
  try {
    const response = await fetch(
      `https://api.kraken.com/0/public/Ticker?pair=${pair}`,
      { 
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeoutMs)
      }
    )
    
    if (!response.ok) {
      throw new Error(`Kraken API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    const ticker = data.result?.[pair] || data.result?.[Object.keys(data.result || {})[0]]
    const price = parseFloat(ticker?.c?.[0])
    
    if (!price || price <= 0) {
      throw new Error('Invalid price from Kraken')
    }
    
    return {
      price,
      sources: [{
        src: 'kraken',
        price,
        ts: new Date().toISOString(),
        ok: true
      }],
      ok: true
    }
  } catch (error) {
    return {
      price: 0,
      sources: [{
        src: 'kraken',
        price: 0,
        ts: new Date().toISOString(),
        ok: false
      }],
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Remove outliers using Median Absolute Deviation (MAD)
 */
function trimOutliers(prices: number[]): number[] {
  if (prices.length <= 2) return prices
  
  // Sort prices
  const sorted = [...prices].sort((a, b) => a - b)
  
  // Calculate median
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]
  
  // Calculate MAD
  const deviations = sorted.map(price => Math.abs(price - median))
  const mad = deviations.length % 2 === 0
    ? (deviations[deviations.length / 2 - 1] + deviations[deviations.length / 2]) / 2
    : deviations[Math.floor(deviations.length / 2)]
  
  // Filter outliers (keep prices within 2.5 * MAD of median)
  const threshold = 2.5 * mad
  return prices.filter(price => Math.abs(price - median) <= threshold)
}

/**
 * Calculate median of an array
 */
function median(numbers: number[]): number {
  if (numbers.length === 0) return 0
  
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

/**
 * Main oracle function - fetches price from multiple sources
 */
export async function snapshotPriceUSD(
  assetId: string,
  symbol?: string,
  config: Partial<OracleConfig> = {}
): Promise<PriceSnapshot> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const timestamp = new Date().toISOString()
  
  // Map asset IDs to symbols for different APIs
  const symbolMap: Record<string, string> = {
    'bonk': 'BONK',
    'dogwifhat': 'WIF',
    'pepe': 'PEPE',
    'solana': 'SOL',
    'bitcoin': 'BTC',
    'ethereum': 'ETH'
  }
  
  const apiSymbol = symbol || symbolMap[assetId.toLowerCase()] || assetId.toUpperCase()
  
  // Fetch from all sources in parallel
  const calls = [
    fetchCoingecko(assetId),
    fetchCoincap(assetId),
    fetchPaprika(assetId),
    fetchBinance(apiSymbol),
    fetchKraken(`${apiSymbol}USD`)
  ]
  
  try {
    const results = await Promise.allSettled(calls)
    const traces: OracleTrace[] = []
    const prices: number[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.ok) {
        traces.push(...result.value.sources)
        prices.push(result.value.price)
      } else {
        // Add failed trace
        const sourceNames = ['coingecko', 'coincap', 'paprika', 'binance', 'kraken']
        traces.push({
          src: sourceNames[index],
          price: 0,
          ts: timestamp,
          ok: false
        })
      }
    })
    
    // Check if we have enough sources
    if (prices.length < 2) {
      throw new Error('INSUFFICIENT_SOURCES: Less than 2 sources succeeded')
    }
    
    // Remove outliers and calculate median
    const filteredPrices = trimOutliers(prices)
    const finalPrice = median(filteredPrices)
    
    if (finalPrice <= 0) {
      throw new Error('INVALID_PRICE: Median price is invalid')
    }
    
    return {
      price: finalPrice,
      ts: timestamp,
      sources: traces
    }
    
  } catch (error) {
    console.error('Oracle snapshot failed:', error)
    throw new Error(`Oracle failure: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function snapshotPriceWithRetry(
  assetId: string,
  symbol?: string,
  maxRetries: number = 3
): Promise<PriceSnapshot> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await snapshotPriceUSD(assetId, symbol)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed')
}