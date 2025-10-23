import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface WalletInfo {
  address: string;
  balance: number;
  connected: boolean;
  walletName: string;
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  // Mock wallet connection for demo
  const connectWallet = async (walletName: string) => {
    setConnecting(true);
    setError("");
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock wallet data
      const mockWallet: WalletInfo = {
        address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
        balance: 12.5,
        connected: true,
        walletName
      };
      
      setWallet(mockWallet);
    } catch (err) {
      setError("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setError("");
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (wallet?.connected) {
    return (
      <Card className="p-3 bg-slate-800/50 border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white">{wallet.walletName}</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {formatAddress(wallet.address)}
              </span>
              <button
                onClick={copyAddress}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {wallet.balance.toFixed(2)} SOL
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={disconnectWallet}
            className="text-slate-400 hover:text-white p-1"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span className="text-xs text-red-400">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => connectWallet("Phantom")}
          disabled={connecting}
          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-purple-600/30 hover:text-white h-10"
        >
          {connecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          Phantom
        </Button>
        
        <Button
          onClick={() => connectWallet("Solflare")}
          disabled={connecting}
          className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-cyan-600/30 hover:text-white h-10"
        >
          {connecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          Solflare
        </Button>
        
        <Button
          onClick={() => connectWallet("Backpack")}
          disabled={connecting}
          className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-orange-300 hover:from-orange-500/30 hover:to-orange-600/30 hover:text-white h-10"
        >
          {connecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          Backpack
        </Button>
        
        <Button
          onClick={() => connectWallet("WalletConnect")}
          disabled={connecting}
          className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-blue-300 hover:from-blue-500/30 hover:to-blue-600/30 hover:text-white h-10"
        >
          {connecting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4 mr-2" />
          )}
          WalletConnect
        </Button>
      </div>
      
      <div className="text-xs text-slate-400 text-center">
        Connect your Solana wallet to start playing
      </div>
    </div>
  );
}
