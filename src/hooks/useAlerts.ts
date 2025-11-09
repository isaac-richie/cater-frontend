import { useState, useEffect, useCallback } from 'react'
import { PriceAlert } from '@/types'
import { alertsApi } from '@/lib/api/alerts'
import { useActiveAccount } from 'thirdweb/react'

export function useAlerts(status?: 'active' | 'triggered' | 'cancelled') {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const account = useActiveAccount()

  const fetchAlerts = useCallback(async () => {
    if (!account?.address) {
      setAlerts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await alertsApi.get(account.address, status)
      if (result.success && result.alerts) {
        setAlerts(result.alerts)
      } else {
        setError(result.error || 'Failed to fetch alerts')
      }
    } catch (err) {
      setError('Failed to fetch alerts')
    } finally {
      setLoading(false)
    }
  }, [account?.address, status])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const createAlert = async (
    marketId: string,
    marketQuestion: string,
    targetPrice: number,
    condition: 'above' | 'below' | 'equals',
    notes?: string
  ) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false, error: 'Please connect your wallet' }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await alertsApi.create(
        account.address,
        marketId,
        marketQuestion,
        targetPrice,
        condition,
        notes
      )

      if (result.success && result.alert) {
        setAlerts([result.alert, ...alerts])
        return { success: true, alert: result.alert }
      } else {
        setError(result.error || 'Failed to create alert')
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to create alert'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteAlert = async (alertId: string) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await alertsApi.delete(alertId)

      if (result.success) {
        setAlerts(alerts.filter(alert => alert.id !== alertId))
        return { success: true }
      } else {
        setError(result.error || 'Failed to delete alert')
        return { success: false }
      }
    } catch (err) {
      setError('Failed to delete alert')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const updateAlert = async (alertId: string, updates: Partial<PriceAlert>) => {
    if (!account?.address) {
      setError('Please connect your wallet')
      return { success: false }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await alertsApi.update(alertId, updates)

      if (result.success && result.alert) {
        setAlerts(
          alerts.map(alert =>
            alert.id === alertId ? result.alert! : alert
          )
        )
        return { success: true }
      } else {
        setError(result.error || 'Failed to update alert')
        return { success: false }
      }
    } catch (err) {
      setError('Failed to update alert')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return {
    alerts,
    loading,
    error,
    createAlert,
    deleteAlert,
    updateAlert,
    refetch: fetchAlerts,
  }
}

