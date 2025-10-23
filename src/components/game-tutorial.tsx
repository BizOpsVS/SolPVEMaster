import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Target, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle,
  DollarSign,
  Users
} from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  content: React.ReactNode
  example?: React.ReactNode
}

export function GameTutorial({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showExample, setShowExample] = useState(false)

  const steps: TutorialStep[] = [
    {
      id: "what-is",
      title: "What is SolPVE?",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-slate-300">
            SolPVE is a <span className="text-cyan-400 font-bold">short-duration prediction game</span> where you bet on whether a cryptocurrency will go up or down.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              The AI Line
            </h4>
            <p className="text-slate-300">
              Our AI creates a target line (e.g., +3.0%). You bet whether the actual price change will be <span className="text-cyan-400 font-semibold">OVER</span> or <span className="text-purple-400 font-semibold">UNDER</span> that line.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "how-to-play",
      title: "How to Play",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold">1</span>
                </div>
                <h4 className="font-bold text-white">Pick a Pool</h4>
              </div>
              <p className="text-sm text-slate-300">Choose from 10m, 30m, 1h, 6h, or 12h pools</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <h4 className="font-bold text-white">Choose Your Side</h4>
              </div>
              <p className="text-sm text-slate-300">Bet OVER or UNDER the AI line</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <h4 className="font-bold text-white">Win Together</h4>
              </div>
              <p className="text-sm text-slate-300">Winners split the losing pot proportionally</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "timing",
      title: "Pool Timing",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
            <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Enrollment Window (40% of duration)
            </h4>
            <p className="text-slate-300">
              You can place and cancel bets during this time. For a 10-minute pool, you have 4 minutes to decide.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
            <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lock Phase
            </h4>
            <p className="text-slate-300">
              Pool locks, entry price is recorded. No more bets can be placed.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Resolution
            </h4>
            <p className="text-slate-300">
              Final price is recorded, winners are determined, and payouts are calculated.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "payouts",
      title: "How Payouts Work",
      content: (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Proportional Distribution
            </h4>
            <p className="text-slate-300 mb-3">
              Winners split the losing side's pot based on how much they contributed.
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Your stake:</span>
                <span className="text-white font-mono">10 SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your side total:</span>
                <span className="text-white font-mono">50 SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your share:</span>
                <span className="text-cyan-400 font-mono">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Losing pot:</span>
                <span className="text-white font-mono">40 SOL</span>
              </div>
              <div className="flex justify-between border-t border-slate-600 pt-2">
                <span className="text-green-400 font-semibold">Your payout:</span>
                <span className="text-green-400 font-mono font-bold">18 SOL</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Platform Fee
            </h4>
            <p className="text-slate-300">
              Only 2% fee on the losing pot. No fee on ties or refunds.
            </p>
          </div>
        </div>
      ),
      example: (
        <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-600">
          <h5 className="font-bold text-white mb-3">Example Calculation</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Over Pool:</span>
              <span className="text-cyan-400">60 SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Under Pool:</span>
              <span className="text-purple-400">40 SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Your stake (Over):</span>
              <span className="text-white">15 SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Your share:</span>
              <span className="text-white">25% (15/60)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Losing pot after fee:</span>
              <span className="text-white">39.2 SOL (40 × 0.98)</span>
            </div>
            <div className="flex justify-between border-t border-slate-600 pt-2">
              <span className="text-green-400 font-semibold">Your payout:</span>
              <span className="text-green-400 font-bold">24.8 SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400 font-semibold">Profit:</span>
              <span className="text-green-400 font-bold">+9.8 SOL</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai-confidence",
      title: "Understanding AI Confidence",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
            <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Confidence Score
            </h4>
            <p className="text-slate-300 mb-3">
              The AI's confidence (0-100%) indicates how certain it is about the prediction.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">High Confidence (80-100%):</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Very Strong Signal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Medium Confidence (50-79%):</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Moderate Signal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Low Confidence (0-49%):</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Weak Signal</Badge>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-bold text-white mb-2">Important Notes</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Confidence is informational only - it doesn't affect payouts</li>
              <li>• Higher confidence doesn't guarantee the AI is right</li>
              <li>• Use it as one factor in your decision-making</li>
              <li>• Consider market conditions and your own analysis too</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">How SolPVE Works</h2>
                <p className="text-slate-400">Step {currentStep + 1} of {steps.length}</p>
              </div>
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
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">{currentStepData.title}</h3>
            <div className="text-slate-300">
              {currentStepData.content}
            </div>
            
            {currentStepData.example && showExample && (
              <div className="mt-4">
                {currentStepData.example}
              </div>
            )}
            
            {currentStepData.example && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExample(!showExample)}
                className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                {showExample ? "Hide Example" : "Show Example"}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-cyan-500"
                      : index < currentStep
                        ? "bg-slate-500"
                        : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                Start Playing!
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
