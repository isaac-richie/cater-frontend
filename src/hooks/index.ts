import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { marketApi, signalApi, paymentApi } from '@/lib/api'
import { Market, Signal, MarketAnalysis, MarketFilters } from '@/types'

// Custom hook for markets data
export function useMarkets(filters?: MarketFilters) {
  return useQuery({
    queryKey: ['markets', filters],
    queryFn: async () => {
      const response = await marketApi.getMarkets()
      return response.data.markets
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })
}

// Custom hook for market analysis
export function useMarketAnalysis(marketId: string, enabled = true) {
  return useQuery({
    queryKey: ['market-analysis', marketId],
    queryFn: async () => {
      const response = await marketApi.getAnalysis(marketId)
      return response.data
    },
    enabled: enabled && !!marketId,
    staleTime: 300000, // 5 minutes
  })
}

// Custom hook for signals
export function useSignals(marketId?: string) {
  return useQuery({
    queryKey: ['signals', marketId],
    queryFn: async () => {
      const response = marketId 
        ? await marketApi.getSignals(marketId)
        : await signalApi.getSignals()
      return response.data
    },
    enabled: !!marketId,
    staleTime: 60000, // 1 minute
  })
}

// Custom hook for market filters
export function useMarketFilters() {
  const [filters, setFilters] = useState<MarketFilters>({
    category: 'All',
    status: 'all',
    sortBy: 'volume',
    sortOrder: 'desc',
    priceMin: undefined,
    priceMax: undefined,
    volumeMin: undefined,
    volumeMax: undefined,
  })

  const updateFilter = useCallback((key: keyof MarketFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      category: 'All',
      status: 'all',
      sortBy: 'volume',
      sortOrder: 'desc',
      priceMin: undefined,
      priceMax: undefined,
      volumeMin: undefined,
      volumeMax: undefined,
    })
  }, [])

  return {
    filters,
    updateFilter,
    resetFilters,
  }
}

// Custom hook for payment
export function usePayment() {
  const queryClient = useQueryClient()

  const createPayment = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  const verifyPayment = useMutation({
    mutationFn: paymentApi.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  return {
    createPayment,
    verifyPayment,
  }
}

// Custom hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Custom hook for debounced search
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for window size
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}


