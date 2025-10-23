import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { poolService } from "@/lib/pool-service";
import { Side } from "@/types/pve";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface StakeModalProps {
  poolId: string;
  poolSymbol: string;
  aiLine: number;
  onClose: () => void;
  onStakePlaced: () => void;
}

export function StakeModal({ poolId, poolSymbol, aiLine, onClose, onStakePlaced }: StakeModalProps) {
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStake = async () => {
    if (!selectedSide || !amount) {
      setError("Please select a side and enter an amount");
      return;
    }

    const stakeAmount = parseFloat(amount);
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (stakeAmount < 1) {
      setError("Minimum stake is 1 SOL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Mock user ID - in a real app this would come from authentication
      const userId = "user_demo_123";
      
      await poolService.placeStake(poolId, userId, selectedSide, stakeAmount);
      
      setSuccess(`Successfully staked ${stakeAmount} SOL on ${selectedSide}!`);
      
      // Call the callback to refresh data
      setTimeout(() => {
        onStakePlaced();
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place stake");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Place Your Stake</h3>
              <p className="text-sm text-slate-400">{poolSymbol} Pool</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ×
            </Button>
          </div>

          {/* AI Line Display */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">AI Line</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">+{aiLine.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Will {poolSymbol} go OVER or UNDER this line?
            </p>
          </div>

          {/* Side Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-3 block">Choose Your Side</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedSide === "OVER" ? "default" : "outline"}
                onClick={() => setSelectedSide("OVER")}
                className={`h-16 ${
                  selectedSide === "OVER"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">OVER</span>
                  <span className="text-xs opacity-80">Price will exceed +{aiLine.toFixed(1)}%</span>
                </div>
              </Button>
              
              <Button
                variant={selectedSide === "UNDER" ? "default" : "outline"}
                onClick={() => setSelectedSide("UNDER")}
                className={`h-16 ${
                  selectedSide === "UNDER"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-semibold">UNDER</span>
                  <span className="text-xs opacity-80">Price will stay below +{aiLine.toFixed(1)}%</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Stake Amount (SOL)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
                min="1"
                step="0.1"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Minimum: 1 SOL</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">{success}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={loading || !selectedSide || !amount}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              {loading ? "Placing..." : "Place Stake"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
