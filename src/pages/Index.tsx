import { useEffect, useState } from "react";
import type { PoolCard } from "@/types/pve";
import { PoolCard as PoolCardComponent } from "@/components/pool-card";
import { RunnerCard } from "@/components/runner-card";
import { WalletDisplay } from "@/components/wallet-display";
import { GameTutorial } from "@/components/game-tutorial";
import { CreatePoolModal } from "@/components/create-pool-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { poolService } from "@/lib/pool-service";
import {
  Trophy, Star, TrendingUp, Clock, Target, Zap,
  Coins, BarChart3, Users, Sparkles, Play, HelpCircle,
  ArrowRight, DollarSign, Timer, AlertCircle
} from "lucide-react";

const topRunners = [
  { token: "BONK", roi: "+234%", volume: "12.4M", status: "RESOLVED" as const, price: "$0.00001234" },
  { token: "WIF", roi: "+189%", volume: "8.9M", status: "RESOLVED" as const, price: "$2.45" },
  { token: "SOL", roi: "+156%", volume: "45.2M", status: "RESOLVED" as const, price: "$95.50" },
  { token: "PEPE", roi: "+142%", volume: "23.1M", status: "RESOLVED" as const, price: "$0.00000123" },
  { token: "POPCAT", roi: "+128%", volume: "7.6M", status: "RESOLVED" as const, price: "$0.89" },
  { token: "MEW", roi: "+98%", volume: "11.2M", status: "RESOLVED" as const, price: "$0.00456" },
];

export default function Index() {
  const [pools, setPools] = useState<PoolCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreatePool, setShowCreatePool] = useState(false);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    try {
      setLoading(true);
      const allPools = await poolService.getPools();
      setPools(allPools);
    } catch (error) {
      console.error("Failed to load pools:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPools = pools.filter(pool => pool.status === 'OPEN');
  const lockedPools = pools.filter(pool => pool.status === 'LOCKED');
  const resolvedPools = pools.filter(pool => pool.status === 'RESOLVED');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PVEPOOLS</h1>
                <p className="text-xs text-slate-400">AI-Lined Prediction Pools</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowTutorial(true)}
                className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:text-white"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                How to Play
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
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Coins className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Wallet Balance</p>
                <p className="text-lg font-bold text-white">12.5 SOL</p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Connect your wallet to see your balance and start playing
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <h3 className="font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => setShowCreatePool(true)}
                className="w-full justify-start bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 hover:text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Create Pool
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 hover:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                My Positions
              </Button>
            </div>
          </Card>

          {/* Navigation */}
          <Card className="p-4 bg-slate-800/50 border-slate-700/50">
            <h3 className="font-bold text-white mb-3">Categories</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Quick Pools
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white">
                <Clock className="h-4 w-4 mr-2" />
                Longer Pools
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Resolved
              </Button>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    AI-Lined Prediction Pools
                  </h2>
                  <p className="text-lg text-slate-300 max-w-2xl">
                    Bet on whether crypto prices will go OVER or UNDER our AI's target line. 
                    Winners split the losing pot proportionally.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white mb-1">$47.2K</div>
                  <div className="text-sm text-slate-400">Active Pools</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start a Quick Pool
                </Button>
                <Button 
                  size="lg"
                  onClick={() => setShowTutorial(true)}
                  className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:text-white"
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Learn How to Play
                </Button>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl" />
          </section>


          {/* Top Runners */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Top Runners</h2>
              <Button className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 text-slate-300 hover:from-slate-600/50 hover:to-slate-500/50 hover:text-white">
                View All &gt;&gt;
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topRunners.map((runner, index) => (
                <RunnerCard key={index} runner={runner} />
              ))}
            </div>
          </section>

          {/* Quick Pools (10m, 30m, 1h) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Quick Pools</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">10m</Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">30m</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">1h</Badge>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 bg-slate-800/50 border-slate-700/50 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded mb-4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openPools.filter(pool => ['10m', '30m', '1h'].includes(pool.duration)).map((pool) => (
                  <PoolCardComponent key={pool.id} pool={pool} />
                ))}
                {openPools.filter(pool => ['10m', '30m', '1h'].includes(pool.duration)).length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <Clock className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg">No quick pools available right now</p>
                      <p className="text-sm">Check back soon for new opportunities!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Longer Pools (6h, 12h) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Longer Pools</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">6h</Badge>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">12h</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openPools.filter(pool => ['6h', '12h'].includes(pool.duration)).map((pool) => (
                <PoolCardComponent key={pool.id} pool={pool} />
              ))}
            </div>
          </section>

          {/* Locked Pools */}
          {lockedPools.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Locked Pools</h2>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Timer className="h-3 w-3 mr-1" />
                  In Progress
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedPools.map((pool) => (
                  <PoolCardComponent key={pool.id} pool={pool} />
                ))}
              </div>
            </section>
          )}

          {/* Resolved Pools */}
          {resolvedPools.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Recently Resolved</h2>
                <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                  <Trophy className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resolvedPools.map((pool) => (
                  <PoolCardComponent key={pool.id} pool={pool} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && <GameTutorial onClose={() => setShowTutorial(false)} />}
      
      {/* Create Pool Modal */}
      {showCreatePool && (
        <CreatePoolModal 
          onClose={() => setShowCreatePool(false)} 
          onPoolCreated={() => {
            loadPools(); // Refresh pools after creation
            setShowCreatePool(false);
          }} 
        />
      )}
    </div>
  );
}