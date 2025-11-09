import { PriceAlert } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const alertsApi = {
  // Create a new price alert
  async create(
    userWallet: string,
    marketId: string,
    marketQuestion: string,
    targetPrice: number,
    condition: 'above' | 'below' | 'equals',
    notes?: string
  ): Promise<{ success: boolean; alert?: PriceAlert; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_wallet: userWallet,
          market_id: marketId,
          market_question: marketQuestion,
          target_price: targetPrice,
          condition,
          notes: notes || '',
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating alert:', error)
      return { success: false, error: 'Failed to create alert' }
    }
  },

  // Get user's alerts
  async get(
    userWallet: string,
    status?: 'active' | 'triggered' | 'cancelled'
  ): Promise<{ success: boolean; alerts?: PriceAlert[]; error?: string }> {
    try {
      const url = status 
        ? `${API_URL}/alerts/${userWallet}?status=${status}`
        : `${API_URL}/alerts/${userWallet}`
      
      const response = await fetch(url)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return { success: false, error: 'Failed to fetch alerts' }
    }
  },

  // Update an alert
  async update(
    alertId: string,
    updates: Partial<PriceAlert>
  ): Promise<{ success: boolean; alert?: PriceAlert; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating alert:', error)
      return { success: false, error: 'Failed to update alert' }
    }
  },

  // Delete an alert
  async delete(alertId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/alerts/${alertId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting alert:', error)
      return { success: false, error: 'Failed to delete alert' }
    }
  },
}

