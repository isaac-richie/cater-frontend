'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { Market } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ROICalculatorProps {
  market: Market
  onClose?: () => void
}

interface ROIResult {
  investmentAmount: number
  position: 'YES' | 'NO'
  entryPrice: number
  sharesBought: number
  platformFee: number
  
  // If win
  profitIfWin: number
  roiIfWin: number
  totalIfWin: number
  
  // If lose
  lossIfLose: number
  roiIfLose: number
  totalIfLose: number
  
  // Expected value
  expectedValue: number
  expectedROI: number
  riskRewardRatio: number
  breakEvenPrice: number
}

const PLATFORM_FEE_RATE = 0.00 // Polymarket has 0% trading fees

export function ROICalculator({ market, onClose }: ROICalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(100)
  const [position, setPosition] = useState<'YES' | 'NO'>('YES')
  const [result, setResult] = useState<ROIResult | null>(null)

  const calculateROI = useCallback(() => {
    if (investmentAmount <= 0) {
      setResult(null)
      return
    }

    const entryPrice = position === 'YES' ? market.current_price : (1 - market.current_price)
    const platformFee = investmentAmount * PLATFORM_FEE_RATE
    const effectiveInvestment = investmentAmount - platformFee
    const sharesBought = effectiveInvestment / entryPrice

    // If position wins
    const totalIfWin = sharesBought * 1.00
    const profitIfWin = totalIfWin - investmentAmount
    const roiIfWin = (profitIfWin / investmentAmount) * 100

    // If position loses
    const totalIfLose = 0
    const lossIfLose = -investmentAmount
    const roiIfLose = -100

    // Expected value (using AI confidence or market price)
    const winProbability = position === 'YES' ? market.current_price : (1 - market.current_price)
    const expectedValue = (winProbability * profitIfWin) + ((1 - winProbability) * lossIfLose)
    const expectedROI = (expectedValue / investmentAmount) * 100

    // Risk/reward ratio
    const potentialGain = Math.abs(profitIfWin)
    const potentialLoss = Math.abs(lossIfLose)
    const riskRewardRatio = potentialGain / potentialLoss

    // Break-even price
    const breakEvenPrice = investmentAmount / sharesBought

    setResult({
      investmentAmount,
      position,
      entryPrice,
      sharesBought,
      platformFee,
      profitIfWin,
      roiIfWin,
      totalIfWin,
      lossIfLose,
      roiIfLose,
      totalIfLose,
      expectedValue,
      expectedROI,
      riskRewardRatio,
      breakEvenPrice
    })
  }, [investmentAmount, position, market])

  useEffect(() => {
    calculateROI()
  }, [calculateROI])


  return (
    <Card className="polymarket-card-gradient border-2 border-blue-500 dark:border-blue-400 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">ROI Calculator</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              ✕
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{market.question}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Investment Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
              className="pl-10 text-lg font-semibold"
              placeholder="100"
              min="1"
              max="100000"
            />
          </div>
          <div className="flex justify-between mt-2">
            {[50, 100, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setInvestmentAmount(amount)}
                className="text-xs"
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Position Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Position
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={position === 'YES' ? 'default' : 'outline'}
              onClick={() => setPosition('YES')}
              className={position === 'YES' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 dark:text-green-400'}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Buy YES @ {formatPrice(market.current_price)}
            </Button>
            <Button
              variant={position === 'NO' ? 'default' : 'outline'}
              onClick={() => setPosition('NO')}
              className={position === 'NO' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-600 text-red-600 dark:text-red-400'}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Buy NO @ {formatPrice(1 - market.current_price)}
            </Button>
          </div>
        </div>

        {result && (
          <>
            {/* Entry Details */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Entry Price</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(result.entryPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shares Bought</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.sharesBought.toFixed(2)}</span>
              </div>
            </div>

            {/* Profit/Loss Scenarios */}
            <div className="grid grid-cols-2 gap-3">
              {/* If Win */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">IF {position} WINS</span>
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  +${result.profitIfWin.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{result.roiIfWin.toFixed(1)}% ROI
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Total: ${result.totalIfWin.toFixed(2)}
                </div>
              </div>

              {/* If Lose */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">IF {position === 'YES' ? 'NO' : 'YES'} WINS</span>
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300 mb-1">
                  ${result.lossIfLose.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  {result.roiIfLose.toFixed(1)}% ROI
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Total: $0.00
                </div>
              </div>
            </div>

            {/* Simple Summary */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Potential Profit</div>
                <div className={`text-3xl font-bold ${result.profitIfWin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  +${result.profitIfWin.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  if {position} wins • {result.roiIfWin.toFixed(1)}% return
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

