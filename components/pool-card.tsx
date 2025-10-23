"use client"

import type React from "react"
import type { PoolCard as PoolCardType } from "@/types/pve"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Clock, Target, Zap } from "lucide-react"
import Link from "next/link"
import { Timer } from "./timer"

export function PoolCard({ pool }: { pool: PoolCardType }) {
  const isOpen = pool.status === 'OPEN'
  const isLocked = pool.status === 'LOCKED'
  const isResolved = pool.status === 'RESOLVED'
  
  // Determine the correct route
  const poolRoute = `/pool/${pool.id}`

  return (
    <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      <Link href={poolRoute} className="block p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
              <span className="text-lg font-bold text-cyan-400">{pool.asset_symbol.slice(0, 2)}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{pool.asset_symbol}</h3>
              <p className="text-sm text-slate-400">
                {pool.duration} Pool
              </p>
            </div>
          </div>
          <Badge
            variant={isOpen ? "default" : isLocked ? "secondary" : "outline"}
            className={
              isOpen
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : isLocked
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
            }
          >
            {pool.status}
          </Badge>
        </div>

        {/* AI Line & Confidence */}
        <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-slate-300">AI Line</span>
            </div>
            <span className="text-lg font-bold text-cyan-400 font-mono">+{pool.ai_line_pct.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-slate-300">Confidence</span>
            </div>
            <span className="text-sm font-bold text-purple-400 font-mono">{pool.confidence_pct}%</span>
          </div>
        </div>

        {/* Pool Stats */}
        <div className="mb-4 space-y-3">
          {/* Over/Under Distribution */}
          <div className="space-y-2">
            <div className="flex h-6 rounded-lg overflow-hidden border border-slate-600/50">
              <div
                className="bg-gradient-to-r from-cyan-500/30 to-cyan-400/30 flex items-center justify-center text-xs font-semibold text-cyan-300"
                style={{ width: `${pool.over_pct || 50}%` }}
              >
                {pool.over_pct && pool.over_pct > 20 && `${pool.over_pct.toFixed(0)}%`}
              </div>
              <div
                className="bg-gradient-to-r from-purple-500/30 to-purple-400/30 flex items-center justify-center text-xs font-semibold text-purple-300"
                style={{ width: `${pool.under_pct || 50}%` }}
              >
                {pool.under_pct && pool.under_pct > 20 && `${pool.under_pct.toFixed(0)}%`}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">Over</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-purple-400" />
                <span className="text-purple-400 font-semibold">Under</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button 
            className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg"
            size="sm"
            disabled={!isOpen}
          >
            Over
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg"
            size="sm"
            disabled={!isOpen}
          >
            Under
          </Button>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" />
            <Timer 
              lockTs={Math.floor(new Date(pool.lock_at).getTime() / 1000)} 
              endTs={Math.floor(new Date(pool.resolve_at).getTime() / 1000)} 
              status={pool.status} 
            />
          </div>
          <div className="text-xs text-slate-500">
            {pool.duration}
          </div>
        </div>
      </Link>
    </Card>
  )
}
