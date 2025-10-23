export type Side = "OVER" | "UNDER"
export type Status = "OPEN" | "LOCKED" | "RESOLVED" | "SETTLED" | "ADMIN_REVIEW" | "REFUND"
export type Duration = "10m" | "30m" | "1h" | "6h" | "12h"

export interface OracleTrace {
  src: string
  price: number
  ts: string
  ok: boolean
}

export interface PriceSnapshot {
  price: number
  ts: string
  sources: OracleTrace[]
}

export interface AILineContract {
  line_bps: number // e.g., 300 => +3.00%
  confidence_pct: number // 0-100
  model_version: string // e.g., "pve-v0.3"
  commit: string // sha256-of-run
  generated_at: string // ISO8601
}

export interface PoolResult {
  ret_pct: number
  line_pct: number
  winner: Side | "TIE" | null
  fee_pct: number
}

export interface PoolPots {
  over: number
  under: number
}

export interface PoolSnapshots {
  entry: PriceSnapshot
  exit: PriceSnapshot
}

export interface PoolListItem {
  id: string
  asset_id: string
  asset_symbol: string
  currency: string
  duration: Duration
  ai: AILineContract
  start_at: string
  lock_at: string
  resolve_at: string
  status: Status
  pots: PoolPots
  snapshots?: PoolSnapshots
  result?: PoolResult
}

export interface PoolCard {
  id: string
  asset_symbol: string
  duration: Duration
  status: Status
  lock_at: string
  resolve_at: string
  ai_line_pct: number
  confidence_pct: number
  over_pct?: number
  under_pct?: number
}

export interface Stake {
  id: string
  pool_id: string
  user_id: string
  side: Side
  amount: number
  created_at: string
  status: "ACTIVE" | "CANCELLED"
}

export interface Settlement {
  id: string
  pool_id: string
  user_id: string
  side: Side
  stake: number
  payout: number
  fee_applied: number
  tx_ref: string | null
}

export interface ChartPoint {
  t: number // unix seconds
  p: number // price (number)
}

export interface ProofData {
  hash: string | null // hex sha256 or null when pending
  url: string | null // link to JSON (S3/IPFS) or null
}

export interface PoolDetail {
  id: number
  token: string
  mint: string
  logo?: string | null
  start_ts: number
  lock_ts: number
  end_ts: number
  line_bps: number
  pool_type?: 'PvMarket' | 'PvAI'
  ai: AIChipData | null
  totals: Totals
  status: Status
  winner: Side | "Void" | null
  proof: ProofData
  chart: ChartPoint[] // Real historical price data
  ai_prediction?: ChartPoint[] // AI's predicted price curve (VS AI pools only)
  ai_line_history?: { t: number; line_bps: number; source?: string; note?: string | null }[]
  contract_url?: string | null // Solscan link placeholder
}
