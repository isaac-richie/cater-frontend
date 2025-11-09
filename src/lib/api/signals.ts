// API client for signal purchase history

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
  user_wallet?: string
  market_category?: string
}

export interface SignalsResponse {
  success: boolean
  signals: Signal[]
  count: number
}

export async function getUserSignals(
  walletAddress: string,
  limit: number = 50
): Promise<Signal[]> {
  try {
    const response = await fetch(
      `${API_URL}/users/${walletAddress}/signals?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: SignalsResponse = await response.json()
    return data.signals || []
  } catch (error) {
    console.error('Error fetching user signals:', error)
    return []
  }
}

