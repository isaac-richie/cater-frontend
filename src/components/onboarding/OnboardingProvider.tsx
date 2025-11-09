'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { WelcomeModal } from './WelcomeModal'
import { OnboardingTour } from './OnboardingTour'

interface OnboardingContextType {
  startTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showWelcome, setShowWelcome] = useState(false)
  const [startTour, setStartTour] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('polycaster_welcome_seen')
    const hasCompletedOnboarding = localStorage.getItem('polycaster_onboarding_completed')

    // Show welcome if user hasn't seen it and hasn't completed onboarding
    if (!hasSeenWelcome && !hasCompletedOnboarding) {
      // Small delay to ensure page is loaded
      setTimeout(() => setShowWelcome(true), 1000)
    }
  }, [])

  const handleStartTour = () => {
    setShowWelcome(false)
    localStorage.removeItem('polycaster_onboarding_completed') // Allow restart
    // Small delay before starting tour
    setTimeout(() => setStartTour(true), 300)
  }

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem('polycaster_welcome_seen', 'true')
    localStorage.setItem('polycaster_onboarding_completed', 'true')
  }

  const handleTourComplete = () => {
    setStartTour(false)
    localStorage.setItem('polycaster_onboarding_completed', 'true')
  }

  return (
    <OnboardingContext.Provider value={{ startTour: handleStartTour }}>
      {children}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        onStartTour={handleStartTour}
      />
      {startTour && (
        <OnboardingTour onComplete={handleTourComplete} />
      )}
    </OnboardingContext.Provider>
  )
}

