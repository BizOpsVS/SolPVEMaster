"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Trophy, Star } from "lucide-react"

interface RunnerCardProps {
  runner: {
    token: string
    roi: string
    volume: string
    status: "RESOLVED" | "OPEN" | "LOCKED"
  }
}

export function RunnerCard({ runner }: RunnerCardProps) {
  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <span className="font-bold text-white text-lg">{runner.token}</span>
            <div className="text-xs text-slate-400">Volume: {runner.volume}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400 font-mono">{runner.roi}</div>
          <div className="text-xs text-slate-400">{runner.status}</div>
        </div>
      </div>
      
      {/* ROI Bar */}
      <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(10, parseFloat(runner.roi.replace('+', '').replace('%', ''))))}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">ROI Performance</span>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Top Runner</span>
        </div>
      </div>
    </Card>
  )
}
