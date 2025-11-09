import axios from 'axios'
import { Market, Signal, ApiResponse, MarketAnalysis } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const marketApi = {
  // Get all markets
  getMarkets: async (): Promise<ApiResponse<{ markets: Market[] }>> => {
    const response = await api.get('/markets')
    return response.data
  },

  // Get market by ID
  getMarket: async (id: string): Promise<ApiResponse<Market>> => {
    const response = await api.get(`/markets/${id}`)
    return response.data
  },

  // Get market analysis
  getAnalysis: async (marketId: string): Promise<ApiResponse<MarketAnalysis>> => {
    const response = await api.get(`/markets/${marketId}/analysis`)
    return response.data
  },

  // Get signals for a market
  getSignals: async (marketId: string): Promise<ApiResponse<Signal[]>> => {
    const response = await api.get(`/markets/${marketId}/signals`)
    return response.data
  },
}

export const signalApi = {
  // Get all signals
  getSignals: async (): Promise<ApiResponse<Signal[]>> => {
    const response = await api.get('/signals')
    return response.data
  },

  // Get signal by ID
  getSignal: async (id: string): Promise<ApiResponse<Signal>> => {
    const response = await api.get(`/signals/${id}`)
    return response.data
  },
}

export const paymentApi = {
  // Create payment
  createPayment: async (data: {
    marketId: string
    amount: number
    walletAddress: string
  }): Promise<ApiResponse<{ paymentId: string; transactionHash?: string }>> => {
    const response = await api.post('/payment/create', data)
    return response.data
  },

  // Verify payment
  verifyPayment: async (paymentId: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const response = await api.post(`/payment/verify/${paymentId}`)
    return response.data
  },
}

export default api


