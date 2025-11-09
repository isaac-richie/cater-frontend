import { createWallet, inAppWallet } from 'thirdweb/wallets'
import { client } from '@/app/client'

// Configure supported wallets
export const wallets = [
  // In-App Wallet with email login (must be first for better UX)
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook'], // Email + social logins
    },
  }),
  // Traditional wallets
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.trustwallet.app'),
]

// Default wallet (MetaMask)
export const defaultWallet = createWallet('io.metamask')

// Export the client
export { client }
