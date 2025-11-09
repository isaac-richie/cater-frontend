export interface Market {
  id: string
  question: string
  description: string
  current_price: number
  confidence: string
  end_date: string
  category: string
  volume: number
  liquidity: number
  price_change_24h: number
  price_change_percent: number
  price_trend: 'up' | 'down' | 'stable'
  outcomes: string
  active: boolean
  closed: boolean
  created_at?: string
  updated_at?: string
  url?: string
  raw_data: any
}

export interface Signal {
  id: string
  market_id: string
  market_question: string
  signal_type: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence_score: number
  price_target: number
  reasoning: string
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  raw_analysis: string
  created_at: string
}

export interface User {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
  is_active: boolean
  total_signals_purchased: number
  total_spent: number
  metadata: any
  telegram_id?: string
  username?: string
}

export interface PaymentData {
  transaction_hash: string
  amount: number
  currency: string
  wallet_address: string
  status: 'pending' | 'verified' | 'failed'
}

// Additional types for the new frontend
export interface MarketFilters {
  category?: string
  status?: 'active' | 'closed' | 'all'
  sortBy?: 'volume' | 'price' | 'trend' | 'date'
  sortOrder?: 'asc' | 'desc'
  priceMin?: number
  priceMax?: number
  volumeMin?: number
  volumeMax?: number
}

export interface MarketStats {
  totalMarkets: number
  totalVolume: number
  activeMarkets: number
  trendingMarkets: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface MarketAnalysis {
  marketId: string
  analysis: string
  confidence: number
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  priceTarget: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  reasoning: string[]
  createdAt: string
  // Premium $100 analysis fields
  executiveSummary?: string
  marketContext?: string
  fundamentalAnalysis?: string
  technicalAnalysis?: string
  marketMicrostructure?: string
  keyFactors?: string[]
  riskAssessment?: string
  opportunityAnalysis?: string
  priceAnalysis?: string
  competitiveAnalysis?: string
  actionPlan?: string
}

// Watchlist types
export interface WatchlistItem {
  id: string
  user_wallet: string
  market_id: string
  market_question: string
  added_at: string
  notes?: string
  alert_enabled: boolean
  alert_price?: number
}

// Price Alert types
export interface PriceAlert {
  id: string
  user_wallet: string
  market_id: string
  market_question: string
  target_price: number
  condition: 'above' | 'below' | 'equals'
  status: 'active' | 'triggered' | 'cancelled'
  created_at: string
  triggered_at?: string
  last_checked_at?: string
  notification_sent: boolean
  notes?: string
}

