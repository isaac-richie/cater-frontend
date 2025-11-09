'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Brain } from 'lucide-react'
import { Facilitator } from '@/components/ai/Facilitator'
import { Market, MarketAnalysis } from '@/types'

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  market: Market | null
}

export function AIAnalysisModal({ isOpen, onClose, market }: AIAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)

  const handleAnalysisComplete = (completedAnalysis: MarketAnalysis) => {
    setAnalysis(completedAnalysis)
  }

  const handleClose = () => {
    setAnalysis(null)
    onClose()
  }

  if (!market) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>AI Market Analysis</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {market.question}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Category: {market.category}</span>
              <span>•</span>
              <span>Current Price: {market.current_price}¢</span>
              <span>•</span>
              <span>Volume: ${market.volume.toLocaleString()}</span>
            </div>
          </div>

          {/* Facilitator Component */}
          <Facilitator
            marketId={market.id}
            marketQuestion={market.question}
            onAnalysisComplete={handleAnalysisComplete}
          />

          {/* Analysis Summary */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Separator />
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analysis Summary
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${
                      analysis.recommendation === 'BUY' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : analysis.recommendation === 'SELL'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {analysis.recommendation}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={`font-medium ${
                      analysis.riskLevel === 'LOW' 
                        ? 'bg-green-100 text-green-800'
                        : analysis.riskLevel === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {analysis.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {Math.round(analysis.confidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Confidence
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysis.priceTarget}¢
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Price Target
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysis.reasoning?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Key Points
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
