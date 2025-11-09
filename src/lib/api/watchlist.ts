import { WatchlistItem } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const watchlistApi = {
  // Add market to watchlist
  async add(
    userWallet: string,
    marketId: string,
    marketQuestion: string,
    notes?: string,
    alertEnabled?: boolean,
    alertPrice?: number
  ): Promise<{ success: boolean; watchlistItem?: WatchlistItem; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_wallet: userWallet,
          market_id: marketId,
          market_question: marketQuestion,
          notes: notes || '',
          alert_enabled: alertEnabled || false,
          alert_price: alertPrice || null,
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      return { success: false, error: 'Failed to add to watchlist' }
    }
  },

  // Get user's watchlist
  async get(userWallet: string): Promise<{ success: boolean; watchlist?: WatchlistItem[]; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/watchlist/${userWallet}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      return { success: false, error: 'Failed to fetch watchlist' }
    }
  },

  // Remove market from watchlist
  async remove(userWallet: string, marketId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/watchlist/${userWallet}/${marketId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      return { success: false, error: 'Failed to remove from watchlist' }
    }
  },

  // Update watchlist item
  async update(
    userWallet: string,
    marketId: string,
    updates: Partial<Omit<WatchlistItem, 'id' | 'user_wallet' | 'market_id' | 'added_at'>>
  ): Promise<{ success: boolean; watchlistItem?: WatchlistItem; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/watchlist/${userWallet}/${marketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating watchlist item:', error)
      return { success: false, error: 'Failed to update watchlist item' }
    }
  },

  // Check if market is in watchlist
  async check(userWallet: string, marketId: string): Promise<{ success: boolean; isInWatchlist?: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/watchlist/${userWallet}/check/${marketId}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error checking watchlist:', error)
      return { success: false, error: 'Failed to check watchlist' }
    }
  },
}

