import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price in cents (Polymarket style)
export function formatPrice(price: number): string {
  const cents = Math.round(price * 100)
  return `${cents}¢`
}

// Format volume with K/M suffixes
export function formatVolume(volume: number | string): string {
  const v = typeof volume === 'string' ? parseFloat(volume) : volume
  if (Number.isNaN(v)) return '$0'
  if (v >= 1_000_000) {
    return `$${(v / 1_000_000).toFixed(1)}M`
  } else if (v >= 1_000) {
    return `$${(v / 1_000).toFixed(1)}K`
  } else {
    return `$${v.toFixed(0)}`
  }
}

// Format liquidity
export function formatLiquidity(liquidity: number | string): string {
  const l = typeof liquidity === 'string' ? parseFloat(liquidity) : liquidity
  if (Number.isNaN(l)) return '$0'
  if (l >= 1_000_000) {
    return `$${(l / 1_000_000).toFixed(1)}M`
  } else if (l >= 1_000) {
    return `$${(l / 1_000).toFixed(1)}K`
  } else {
    return `$${l.toFixed(0)}`
  }
}

// Format time remaining (for future dates)
export function formatTimeRemaining(endDate: string): string {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Closed'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Format time ago (for past dates)
export function formatTimeAgo(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  
  const now = new Date()
  const past = new Date(dateString)
  const diff = now.getTime() - past.getTime()

  if (diff < 0) return 'Just now'

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)

  if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
  } else {
    return 'Just now'
  }
}

// Get trend color class
export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return 'text-green-600 bg-green-50'
    case 'down':
      return 'text-red-600 bg-red-50'
    case 'stable':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Get trend icon
export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    case 'stable':
      return '→'
    default:
      return '→'
  }
}

// Format percentage change
export function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

// Get risk level color
export function getRiskLevelColor(riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (riskLevel) {
    case 'LOW':
      return 'text-green-600 bg-green-50'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50'
    case 'HIGH':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}