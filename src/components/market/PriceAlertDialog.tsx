'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Bell, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { Market } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useAlerts } from '@/hooks/useAlerts'
import { useActiveAccount } from 'thirdweb/react'

interface PriceAlertDialogProps {
  market: Market
  onClose: () => void
}

export function PriceAlertDialog({ market, onClose }: PriceAlertDialogProps) {
  const [targetPrice, setTargetPrice] = useState<string>((market.current_price * 100).toFixed(0))
  const [condition, setCondition] = useState<'above' | 'below' | 'equals'>('above')
  const [notes, setNotes] = useState('')
  const { createAlert, loading } = useAlerts()
  const account = useActiveAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) {
      alert('Please connect your wallet first')
      return
    }

    const priceInDecimal = parseFloat(targetPrice) / 100

    if (isNaN(priceInDecimal) || priceInDecimal < 0 || priceInDecimal > 100) {
      alert('Please enter a valid price between 0 and 100')
      return
    }

    const result = await createAlert(
      market.id,
      market.question,
      priceInDecimal,
      condition,
      notes
    )

    if (result.success) {
      alert('✅ Alert created! You\'ll be notified when the price is triggered.')
      onClose()
    } else {
      alert(`❌ Failed to create alert: ${result.error}`)
    }
  }

  const currentPriceCents = (market.current_price * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Bell className="w-6 h-6 text-blue-500" />
          Create Price Alert
        </DialogTitle>
        <DialogDescription>
          Get notified when this market hits your target price
        </DialogDescription>
      </DialogHeader>

      {/* Market Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {market.question}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">Current Price:</span>
          <Badge variant="secondary" className="text-base font-bold">
            {currentPriceCents}¢
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Condition Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Alert Condition
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={condition === 'above' ? 'default' : 'outline'}
              className={`flex flex-col items-center py-6 ${
                condition === 'above'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              onClick={() => setCondition('above')}
            >
              <TrendingUp className="w-5 h-5 mb-1" />
              <span className="text-sm font-semibold">Above</span>
            </Button>
            
            <Button
              type="button"
              variant={condition === 'below' ? 'default' : 'outline'}
              className={`flex flex-col items-center py-6 ${
                condition === 'below'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
              onClick={() => setCondition('below')}
            >
              <TrendingDown className="w-5 h-5 mb-1" />
              <span className="text-sm font-semibold">Below</span>
            </Button>
            
            <Button
              type="button"
              variant={condition === 'equals' ? 'default' : 'outline'}
              className={`flex flex-col items-center py-6 ${
                condition === 'equals'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
              onClick={() => setCondition('equals')}
            >
              <Target className="w-5 h-5 mb-1" />
              <span className="text-sm font-semibold">Equals</span>
            </Button>
          </div>
        </div>

        {/* Target Price */}
        <div className="space-y-2">
          <Label htmlFor="targetPrice" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Price (in cents)
          </Label>
          <div className="relative">
            <Input
              id="targetPrice"
              type="number"
              min="0"
              max="100"
              step="1"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="text-lg font-bold pr-12"
              placeholder="75"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
              ¢
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Alert will trigger when price is {condition} {targetPrice}¢
          </p>
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (Optional)
          </Label>
          <Input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why are you setting this alert?"
            className="text-sm"
          />
        </div>

        {/* Summary */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <Bell className="w-4 h-4 inline mr-2" />
            You&apos;ll be notified when <strong>{market.question}</strong> price goes{' '}
            <strong className={
              condition === 'above' ? 'text-green-600 dark:text-green-400' :
              condition === 'below' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'
            }>
              {condition}
            </strong>{' '}
            <strong>{targetPrice}¢</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Alert'}
          </Button>
        </div>
      </form>
    </div>
  )
}

