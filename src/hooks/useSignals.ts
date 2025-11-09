'use client'

import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from 'thirdweb/react'
import { getUserSignals, type Signal } from '@/lib/api/signals'

export function useSignals() {
  const account = useActiveAccount()
  const walletAddress = account?.address

  const {
    data: signals = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Signal[]>({
    queryKey: ['signals', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return []
      return await getUserSignals(walletAddress, 100)
    },
    enabled: !!walletAddress,
    staleTime: 1 * 60 * 1000, // 1 minute - signals are fresh for 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts to get latest signals
  })

  return {
    signals,
    loading,
    error: error ? 'Failed to load signal history' : null,
    walletAddress,
    refetch, // Expose refetch function for manual updates
  }
}

