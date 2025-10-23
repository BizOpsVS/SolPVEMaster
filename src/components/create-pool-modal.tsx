import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { poolService } from "@/lib/pool-service";
import { Duration } from "@/types/pve";
import { 
  X, 
  Search, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface CreatePoolModalProps {
  onClose: () => void;
  onPoolCreated: () => void;
}

export function CreatePoolModal({ onClose, onPoolCreated }: CreatePoolModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [duration, setDuration] = useState<Duration>("10m");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [searching, setSearching] = useState(false);

  // AI Line generation
  const [aiLine, setAiLine] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Mock popular assets for quick selection
  const popularAssets: Asset[] = [
    { id: "bonk", symbol: "BONK", name: "Bonk", price: 0.00001234, change24h: 5.2 },
    { id: "wif", symbol: "WIF", name: "dogwifhat", price: 2.45, change24h: -2.1 },
    { id: "pepe", symbol: "PEPE", name: "Pepe", price: 0.00000123, change24h: 8.7 },
    { id: "doge", symbol: "DOGE", name: "Dogecoin", price: 0.15, change24h: 3.4 },
    { id: "sol", symbol: "SOL", name: "Solana", price: 95.50, change24h: -1.2 },
    { id: "popcat", symbol: "POPCAT", name: "Popcat", price: 0.89, change24h: 12.3 },
  ];

  // Search for assets
  const searchAssets = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Mock search - in real app, this would call CoinGecko/DexScreener APIs
      const results = popularAssets.filter(asset => 
        asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  // Generate AI line
  const generateAILine = async () => {
    if (!selectedAsset) return;

    setGeneratingAI(true);
    try {
      // Mock AI line generation
      // In real app, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate realistic AI line based on asset volatility
      const baseLine = Math.random() * 8 + 1; // 1-9%
      const confidence = Math.random() * 40 + 60; // 60-100%
      
      setAiLine(parseFloat(baseLine.toFixed(1)));
      setConfidence(Math.round(confidence));
    } catch (err) {
      setError("Failed to generate AI line");
    } finally {
      setGeneratingAI(false);
    }
  };

  // Create the pool
  const createPool = async () => {
    if (!selectedAsset) {
      setError("Please select an asset");
      return;
    }

    if (aiLine === 0) {
      setError("Please generate AI line first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create pool using the service
      const poolData = {
        asset_id: selectedAsset.id,
        asset_symbol: selectedAsset.symbol,
        duration,
        ai_line_bps: Math.round(aiLine * 100), // Convert to basis points
        confidence_pct: confidence,
        start_at: new Date().toISOString()
      };

      // In a real app, this would call the backend API
      console.log("Creating pool:", poolData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Pool created successfully! ${selectedAsset.symbol} ${duration} pool with +${aiLine}% target`);
      
      setTimeout(() => {
        onPoolCreated();
        onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pool");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => searchAssets(searchQuery), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Pool</h2>
              <p className="text-sm text-slate-400">Step {step} of 3</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Asset Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Select Asset</h3>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search for a token (e.g., BONK, SOL, PEPE)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                {/* Popular Assets */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Popular Assets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularAssets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedAsset?.id === asset.id
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{asset.symbol}</div>
                            <div className="text-xs text-slate-400">{asset.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white">${asset.price.toFixed(6)}</div>
                            <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Search Results</h4>
                    {searchResults.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className="w-full p-3 rounded-lg border border-slate-600 bg-slate-800/50 hover:border-slate-500 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{asset.symbol}</div>
                            <div className="text-xs text-slate-400">{asset.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white">${asset.price.toFixed(6)}</div>
                            <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedAsset}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  Next: Duration
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Duration Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Select Duration</h3>
                <p className="text-sm text-slate-400 mb-6">
                  How long should the pool run? Shorter pools are more volatile but exciting.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(["10m", "30m", "1h", "6h", "12h"] as Duration[]).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur)}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        duration === dur
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                      }`}
                    >
                      <Clock className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
                      <div className="font-bold text-white">{dur}</div>
                      <div className="text-xs text-slate-400">
                        {dur === "10m" && "Quick & Fast"}
                        {dur === "30m" && "Short Term"}
                        {dur === "1h" && "Medium Term"}
                        {dur === "6h" && "Long Term"}
                        {dur === "12h" && "Extended"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  Next: AI Line
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Line Generation */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Generate AI Line</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Our AI will analyze {selectedAsset?.symbol} and generate a target percentage for the pool.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-white">{selectedAsset?.symbol}</div>
                      <div className="text-sm text-slate-400">{duration} Pool</div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      AI Analysis
                    </Badge>
                  </div>

                  {aiLine === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-400 mb-4">Ready to generate AI target</p>
                      <Button
                        onClick={generateAILine}
                        disabled={generatingAI}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      >
                        {generatingAI ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Generate AI Line
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">AI Target:</span>
                        <span className="text-2xl font-bold text-cyan-400">+{aiLine}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-lg font-bold text-purple-400">{confidence}%</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        If {selectedAsset?.symbol} goes up more than {aiLine}% → OVER wins<br/>
                        If {selectedAsset?.symbol} goes up less than {aiLine}% → UNDER wins
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Back
                </Button>
                <Button
                  onClick={createPool}
                  disabled={loading || aiLine === 0}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Pool...
                    </>
                  ) : (
                    "Create Pool"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">{success}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
