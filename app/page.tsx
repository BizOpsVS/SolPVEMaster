import type { PoolListItem } from "@/types/pve"
import { PoolCard } from "@/components/pool-card"
import { RunnerCard } from "@/components/runner-card"
import { Button } from "@/components/ui/button"
import { WalletDisplay } from "@/components/wallet-display"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Coins,
  BarChart3,
  Users,
  Sparkles
} from "lucide-react"

async function fetchTopPools(): Promise<PoolListItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    const response = await fetch(`${baseUrl}/api/pools/top`, { cache: "no-store" })
    if (!response.ok) return []
    return response.json()
  } catch (error) {
    console.error("Failed to fetch pools:", error)
    return []
  }
}

const topRunners = [
  { token: "BONK", roi: "+234%", volume: "1.2M SOL", status: "RESOLVED" as const },
  { token: "WIF", roi: "+189%", volume: "890K SOL", status: "RESOLVED" as const },
  { token: "PEPE", roi: "+156%", volume: "2.1M SOL", status: "RESOLVED" as const },
  { token: "POPCAT", roi: "+142%", volume: "756K SOL", status: "RESOLVED" as const },
  { token: "MEW", roi: "+128%", volume: "1.1M SOL", status: "RESOLVED" as const },
  { token: "BOME", roi: "+98%", volume: "2.3M SOL", status: "RESOLVED" as const },
]

export default async function HomePage() {
  const now = Math.floor(Date.now() / 1000)
  
  // Fetch all pools once
  const allPools = await fetchTopPools()
  const aiPools = allPools.filter((p) => p.pool_type === 'PvAI')
  const marketPools = allPools.filter((p) => p.pool_type !== 'PvAI')

  // Fallback pools for PvAI (POPCAT id:8 LOCKED, BONK id:1 OPEN, WIF id:9 OPEN)
  const fallbackAIPools: PoolListItem[] = [
    {
      id: 8,
      token: 'POPCAT',
      mint: 'POPCAT_DEV_AI_MINT_000000000000000000008',
      logo: null,
      line_bps: 260,
      confidence: 0.88,
      lock_ts: now - 1200, // 20 minutes ago (LOCKED)
      end_ts: now + 2 * 3600,
      totals: { over: 12_000_000_000, under: 11_000_000_000 },
      status: 'OPEN', // Database OPEN but time passed = effectively LOCKED
      pool_type: 'PvAI',
      ai: { confidence: 0.88, model: 'pve-v0.3.0', commit: '0xPOPCAT_AI_FALLBACK', payload_url: null },
    },
    {
      id: 1,
      token: 'BONK',
      mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      logo: null,
      line_bps: 300,
      confidence: 0.61,
      lock_ts: now + 4 * 3600, // 4 hours from now
      end_ts: now + 8 * 3600,
      totals: { over: 34_000_000_000, under: 29_000_000_000 },
      status: 'OPEN',
      pool_type: 'PvAI',
      ai: { confidence: 0.61, model: 'pve-v0.3.0', commit: '0xA1B2...ABCD', payload_url: null },
    },
    {
      id: 9,
      token: 'WIF',
      mint: 'WIF_DEV_AI_MINT_000000000000000000009',
      logo: null,
      line_bps: 180,
      confidence: 0.62,
      lock_ts: now + 3 * 3600, // 3 hours from now
      end_ts: now + 7 * 3600,
      totals: { over: 8_000_000_000, under: 7_000_000_000 },
      status: 'OPEN',
      pool_type: 'PvAI',
      ai: { confidence: 0.62, model: 'pve-v0.3.0', commit: '0xWIF_AI_FALLBACK', payload_url: null },
    },
  ]

  // Fallback pools for PvMarket (POPCAT id:3 OPEN, MEW id:4 OPEN, WIF id:2 LOCKED)
  const fallbackMarketPools: PoolListItem[] = [
    {
      id: 3,
      token: 'POPCAT',
      mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
      logo: null,
      line_bps: null,
      confidence: 0,
      lock_ts: now + 3 * 3600, // 3 hours from now
      end_ts: now + 6 * 3600,
      totals: { over: 52_000_000_000, under: 48_000_000_000 },
      status: 'OPEN',
      pool_type: 'PvMarket',
      ai: null,
    },
    {
      id: 4,
      token: 'MEW',
      mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
      logo: null,
      line_bps: null,
      confidence: 0,
      lock_ts: now + 2 * 3600, // 2 hours from now
      end_ts: now + 5 * 3600,
      totals: { over: 24_000_000_000, under: 26_000_000_000 },
      status: 'OPEN',
      pool_type: 'PvMarket',
      ai: null,
    },
    {
      id: 2,
      token: 'WIF',
      mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
      logo: null,
      line_bps: null,
      confidence: 0,
      lock_ts: now - 1800, // 30 minutes ago (LOCKED)
      end_ts: now + 3600,
      totals: { over: 18_000_000_000, under: 24_000_000_000 },
      status: 'OPEN', // Database OPEN but time passed = effectively LOCKED
      pool_type: 'PvMarket',
      ai: null,
    },
  ]

  // Use real pools or fallbacks
  const displayAIPools = aiPools.length > 0 ? aiPools : fallbackAIPools
  const displayMarketPools = marketPools.length > 0 ? marketPools : fallbackMarketPools
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  SolPVE
                </h1>
              </div>
              <p className="text-sm text-slate-400 hidden md:block">Speculative gaming for the people</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Sign Up
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
                Login
              </Button>
              <WalletDisplay />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900/50 border-r border-slate-800/50 p-6 space-y-6">
          {/* User Balance */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-semibold">0</span>
            <Button size="sm" className="ml-auto bg-cyan-500 hover:bg-cyan-600 text-white">
              +
            </Button>
          </div>

          <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 rounded-xl">
            Create a Prediction
          </Button>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/20 text-purple-300">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Prize Pool</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
              <Users className="h-5 w-5" />
              <span>Store (Coming Soon)</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
              <Sparkles className="h-5 w-5" />
              <span>WVS AI (Coming Soon)</span>
            </div>
          </nav>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Basketball", icon: "🏀", color: "from-orange-500 to-red-500" },
                { name: "Golf", icon: "⛳", color: "from-green-500 to-emerald-500" },
                { name: "Football", icon: "⚽", color: "from-blue-500 to-cyan-500" },
                { name: "Finance", icon: "💰", color: "from-green-500 to-lime-500" },
                { name: "MMA", icon: "🥊", color: "from-red-500 to-pink-500" },
                { name: "Gaming", icon: "🎮", color: "from-purple-500 to-indigo-500" },
                { name: "Events", icon: "🌍", color: "from-blue-500 to-purple-500" },
                { name: "Crypto", icon: "₿", color: "from-yellow-500 to-orange-500" },
              ].map((category) => (
                <div key={category.name} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-lg`}>
                    {category.icon}
                  </div>
                  <span className="text-xs text-slate-300 text-center">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">SolPVE Global Prize Pool</h1>
                    <p className="text-slate-300">Earn entry points just for using the platform.</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-2">2,125,000 $VS</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4" />
                  <span>Next drawing: 15:35:45</span>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-slate-800/50 border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Predict</h3>
                </div>
                <p className="text-slate-300">Make or create a prediction on the platform.</p>
              </Card>
              
              <Card className="p-6 bg-slate-800/50 border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Earn</h3>
                </div>
                <p className="text-slate-300">Receive entry points for accuracy + platform usage.</p>
              </Card>
              
              <Card className="p-6 bg-slate-800/50 border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Win</h3>
                </div>
                <p className="text-slate-300">Your entries are automatically submitted into the biweekly drawing.</p>
              </Card>
            </div>
          </section>

          {/* Top Runners */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Top Runners</h2>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                View All &gt;&gt;
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {topRunners.map((runner, index) => (
                <div key={runner.token} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                    index === 0 ? 'from-yellow-500 to-orange-500' :
                    index === 1 ? 'from-gray-400 to-gray-600' :
                    index === 2 ? 'from-amber-600 to-yellow-600' :
                    'from-slate-600 to-slate-700'
                  } flex items-center justify-center text-white font-bold`}>
                    {index + 1}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">{runner.token}</div>
                    <div className="text-xs text-green-400 font-mono">{runner.roi}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Versus AI Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Versus AI</h2>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                View All &gt;&gt;
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAIPools.slice(0, 6).map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </section>

          {/* Versus Market Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Versus Market</h2>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                View All &gt;&gt;
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMarketPools.slice(0, 6).map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
