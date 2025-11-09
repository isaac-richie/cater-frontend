// Market categories
export const MARKET_CATEGORIES = [
  'All',
  'Politics',
  'Sports',
  'Economics',
  'Tech',
  'Crypto',
  'Science',
  'Culture',
] as const

// Market status options
export const MARKET_STATUS = [
  { value: 'all', label: 'All Markets' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
] as const

// Sort options
export const SORT_OPTIONS = [
  { value: 'price', label: 'Price' },
  { value: 'trend', label: 'Trend' },
  { value: 'date', label: 'Date' },
] as const

// Sort order options
export const SORT_ORDER = [
  { value: 'desc', label: 'High to Low' },
  { value: 'asc', label: 'Low to High' },
] as const

// View modes
export const VIEW_MODES = [
  { value: 'grid', label: 'Grid View' },
  { value: 'list', label: 'List View' },
] as const

// API endpoints
export const API_ENDPOINTS = {
  MARKETS: '/markets',
  SIGNALS: '/signals',
  PAYMENT: '/payment',
  ANALYSIS: '/analysis',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_CATEGORY: 'polycasterz_selected_category',
  VIEW_MODE: 'polycasterz_view_mode',
  WALLET_ADDRESS: 'polycasterz_wallet_address',
  USER_PREFERENCES: 'polycasterz_user_preferences',
} as const

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Something went wrong. Please try again.',
  INVALID_DATA: 'Invalid data received from server.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  ANALYSIS_FAILED: 'Analysis failed. Please try again.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PAYMENT_SUCCESS: 'Payment successful!',
  ANALYSIS_SUCCESS: 'Analysis completed successfully!',
  DATA_LOADED: 'Data loaded successfully!',
} as const

