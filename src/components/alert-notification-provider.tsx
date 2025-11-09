'use client'

import { useAlertNotifications } from '@/hooks/useAlertNotifications'

/**
 * Provider component that polls for triggered alerts and shows notifications
 * This component doesn't render anything, it just runs the polling logic
 */
export function AlertNotificationProvider({ children }: { children: React.ReactNode }) {
  // This hook will automatically poll for triggered alerts and show notifications
  useAlertNotifications()
  
  return <>{children}</>
}

