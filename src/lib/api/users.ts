// API client for user operations including email management

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  wallet_address: string
  email?: string
  email_verified?: boolean
  created_at: string
  updated_at: string
  is_active: boolean
  total_signals_purchased: number
  total_spent: number
}

export interface UpdateEmailResponse {
  success: boolean
  user: User
  emailSent: boolean
  message: string
  error?: string
}

export interface VerifyEmailResponse {
  success: boolean
  user: User
  message: string
  error?: string
}

/**
 * Update user email address
 */
export async function updateUserEmail(
  walletAddress: string,
  email: string
): Promise<UpdateEmailResponse> {
  try {
    const response = await fetch(
      `${API_URL}/users/${walletAddress}/email`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating user email:', error)
    return {
      success: false,
      user: {} as User,
      emailSent: false,
      message: error instanceof Error ? error.message : 'Failed to update email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Verify email address with token
 */
export async function verifyEmail(
  token: string
): Promise<VerifyEmailResponse> {
  try {
    const response = await fetch(
      `${API_URL}/users/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error verifying email:', error)
    return {
      success: false,
      user: {} as User,
      message: error instanceof Error ? error.message : 'Failed to verify email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get user by wallet address
 */
export async function getUser(walletAddress: string): Promise<User | null> {
  try {
    const response = await fetch(
      `${API_URL}/users/${walletAddress}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.user || null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

