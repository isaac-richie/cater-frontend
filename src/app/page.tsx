'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MarketHeader } from '@/components/market/MarketHeader'
import { MarketCard } from '@/components/market/MarketCard'
import { AIAnalysisModal } from '@/components/ai/AIAnalysisModal'
import { Button } from '@/components/ui/button'
import { HeroSection, WhatIsSection, UseCasesSection } from '@/components/landing'
import { useMarketFilters } from '@/hooks'
import { Market } from '@/types'
import { 
  TrendingUp, 
  Flame, 
  CircleDot, 
  Target,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { normalizeCategory } from '@/lib/categories'

const LANDING_SKIPPED_KEY = 'polycaster_landing_skipped'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [markets, setMarkets] = useState<Market[]>([])
  const [recentMarkets, setRecentMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [lastFetchKey, setLastFetchKey] = useState<string>('')
  const [showLanding, setShowLanding] = useState(false)

  const { filters, updateFilter } = useMarketFilters()

  // Check if landing should be shown (first-time visitors)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipped = localStorage.getItem(LANDING_SKIPPED_KEY)
      setShowLanding(!skipped)
    }
  }, [])

  const handleSkipLanding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANDING_SKIPPED_KEY, 'true')
      setShowLanding(false)
      // Smooth scroll to markets
      setTimeout(() => {
        const marketsSection = document.getElementById('markets')
        if (marketsSection) {
          marketsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  // Fetch markets function (reusable)
  const fetchMarkets = async (force = false) => {
    const fetchKey = `${searchTerm}-${filters.category}`
    
    // Don't refetch if data is fresh and not forcing
    if (!force && fetchKey === lastFetchKey && markets.length > 0) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      let url
      
      // If there's a search term, use search API
      if (searchTerm && searchTerm.trim().length > 0) {
        url = `${API_URL}/markets/search?q=${encodeURIComponent(searchTerm)}&limit=50`
        console.log(`Searching markets for: "${searchTerm}"`)
      } else {
        // Otherwise fetch by category
        const isAll = !filters.category || filters.category === 'All'
        const limit = isAll ? 100 : 150
        url = isAll
          ? `${API_URL}/markets?limit=${limit}`
          : `${API_URL}/markets/category/${encodeURIComponent(normalizeCategory(filters.category))}?limit=${limit}`
        console.log(`Fetching markets from: ${url}`)
      }
      
      // Also fetch recent markets separately for "Live Markets" section
      if (!searchTerm || searchTerm.trim().length === 0) {
        const recentUrl = `${API_URL}/markets/recent?limit=24`
        try {
          const recentResponse = await fetch(recentUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (recentResponse.ok) {
            const recentData = await recentResponse.json()
            setRecentMarkets(recentData.markets || [])
            console.log(`Fetched ${recentData.markets?.length || 0} recent markets`)
          }
        } catch (err) {
          console.warn('Failed to fetch recent markets:', err)
        }
      } else {
        // Clear recent markets when searching
        setRecentMarkets([])
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      let fetched = data.markets || []

      console.log(`Fetched ${fetched.length} markets`)

      // Fallback: if category endpoint returns empty and not searching, fetch all markets
      if (!searchTerm && (!filters.category || filters.category !== 'All') && fetched.length === 0) {
        console.log('No markets found for category, fetching all markets as fallback')
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const allRes = await fetch(`${API_URL}/markets?limit=50`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const allData = await allRes.json()
        fetched = allData.markets || []
      }

      setMarkets(fetched)
      setLastFetchKey(fetchKey)
    } catch (error) {
      console.error('Backend error:', error)
      setError('Failed to load markets')
      setMarkets([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch markets data (only when search/category changes, not on every mount)
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchMarkets(false) // false = don't force, use cache if available
    }, searchTerm ? 500 : 0) // 500ms delay for search, immediate for category change

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, searchTerm]) // Only refetch when search or category changes

  // Apply client-side filtering for status, price range, and volume range
  const filteredMarkets = markets.filter(market => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !market.active) return false
      if (filters.status === 'closed' && market.active) return false
    }

    // Price range filter (convert to cents for comparison)
    const priceInCents = market.current_price * 100
    if (filters.priceMin !== undefined && priceInCents < filters.priceMin * 100) return false
    if (filters.priceMax !== undefined && priceInCents > filters.priceMax * 100) return false

    // Volume range filter
    if (filters.volumeMin !== undefined && market.volume < filters.volumeMin) return false
    if (filters.volumeMax !== undefined && market.volume > filters.volumeMax) return false

    return true
  })

  // Get trending markets (highest volume)
  const trendingMarkets = [...filteredMarkets]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6)

  // Get live markets - use recent markets if available, otherwise filter from all markets
  const liveMarkets = recentMarkets.length > 0 
    ? recentMarkets.slice(0, 24)
    : filteredMarkets
        .filter(market => market.active && !market.closed)
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0).getTime()
          const dateB = new Date(b.updated_at || b.created_at || 0).getTime()
          return dateB - dateA
        })
        .slice(0, 24)

  // Calculate market stats
  const marketStats = {
    totalMarkets: markets.length,
    activeMarkets: markets.filter(market => market.active).length,
    trendingMarkets: trendingMarkets.length
  }

  const handleAnalyze = async (marketId: string) => {
    const market = markets.find(m => m.id === marketId)
    if (market) {
      setSelectedMarket(market)
      setIsAnalysisModalOpen(true)
    }
  }

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false)
    setSelectedMarket(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading markets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Landing Page Sections - Only show for first-time visitors */}
      {showLanding && (
        <>
          <HeroSection onSkip={handleSkipLanding} />
          <WhatIsSection />
          <UseCasesSection />
        </>
      )}

      {/* Refresh Button - Sticky at top */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMarkets(true)}
            disabled={loading}
            className="flex items-center gap-2"
            title="Refresh markets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
      {/* Header */}
      <MarketHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={filters.category || 'All'}
        onCategoryChange={(category) => updateFilter('category', category)}
        sortBy={filters.sortBy || 'price'}
        onSortChange={(sort) => updateFilter('sortBy', sort)}
        sortOrder={filters.sortOrder || 'desc'}
        onSortOrderChange={(order) => updateFilter('sortOrder', order)}
        marketStats={marketStats}
      />

      <div id="markets" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Show Trending section only for "All" category */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trending Markets</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {trendingMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={true}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Live Markets Section - For "All" category, show only recent live markets */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <CircleDot className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Markets</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {liveMarkets.length} live
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={true}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Live Markets Section - For specific categories, show ALL markets under "Live Markets" */}
        {filters.category && filters.category !== 'All' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <CircleDot className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live {filters.category} Markets
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredMarkets.length} markets
              </span>
            </div>
            
            {filteredMarkets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No markets found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    compact={false}
                    onAnalyze={handleAnalyze}
                  />
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* All Markets Section - Only show for "All" category */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Markets</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredMarkets.length} markets
            </span>
          </div>
          
          {filteredMarkets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No markets found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={false}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          )}
          </motion.section>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        market={selectedMarket}
      />
    </div>
  )
}