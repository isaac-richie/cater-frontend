import { useState, useEffect, useCallback } from 'react'
import { WatchlistItem } from '@/types'
import { watchlistApi } from '@/lib/api/watchlist'
import { useActiveAccount } from 'thirdweb/react'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const account = useActiveAccount()

  const fetchWatchlist = useCallback(async () => {
    if (!account?.address) {
      setWatchlist([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await watchlistApi.get(account.address)
      if (result.success && result.watchlist) {
        setWatchlist(result.watchlist)
      } else {
        setError(result.error || 'Failed to fetch watchlist')
      }
    } catch (err) {
      setError('Failed to fetch watchlist')
    } finally {
      setLoading(false)
    }
  }, [account?.address])

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  const addToWatchlist = async (
    marketId: string,
    marketQuestion: string,
    notes?: string,
    alertEnabled?: boolean,
    alertPrice?: number
  ) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false, error: 'Please connect your wallet' }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await watchlistApi.add(
        account.address,
        marketId,
        marketQuestion,
        notes,
        alertEnabled,
        alertPrice
      )

      if (result.success && result.watchlistItem) {
        setWatchlist([result.watchlistItem, ...watchlist])
        return { success: true }
      } else {
        setError(result.error || 'Failed to add to watchlist')
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to add to watchlist'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (marketId: string) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await watchlistApi.remove(account.address, marketId)

      if (result.success) {
        setWatchlist(watchlist.filter(item => item.market_id !== marketId))
        return { success: true }
      } else {
        setError(result.error || 'Failed to remove from watchlist')
        return { success: false }
      }
    } catch (err) {
      setError('Failed to remove from watchlist')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const updateWatchlistItem = async (
    marketId: string,
    updates: Partial<Omit<WatchlistItem, 'id' | 'user_wallet' | 'market_id' | 'added_at'>>
  ) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await watchlistApi.update(account.address, marketId, updates)

      if (result.success && result.watchlistItem) {
        setWatchlist(
          watchlist.map(item =>
            item.market_id === marketId ? result.watchlistItem! : item
          )
        )
        return { success: true }
      } else {
        setError(result.error || 'Failed to update watchlist item')
        return { success: false }
      }
    } catch (err) {
      setError('Failed to update watchlist item')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const isInWatchlist = (marketId: string) => {
    return watchlist.some(item => item.market_id === marketId)
  }

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
    isInWatchlist,
    refetch: fetchWatchlist,
  }
}

