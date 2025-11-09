'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingTourProps {
  onComplete?: () => void
}

interface Step {
  target: string
  title: string
  content: string
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const steps: Step[] = [
    {
      target: 'body',
      title: 'Welcome to PolyCaster! 👋',
      content: 'Your AI-powered analytics platform for Polymarket prediction markets. Let\'s take a quick tour to show you around!',
      placement: 'center',
    },
    {
      target: '[data-onboarding="search"]',
      title: '🔍 Search Markets',
      content: 'Search for any market by question, category, or keyword. Get instant results from Polymarket\'s live markets.',
      placement: 'bottom',
    },
    {
      target: '[data-onboarding="categories"]',
      title: '📊 Browse by Category',
      content: 'Filter markets by Sports, Crypto, Politics, Tech, Science, and more. Find markets that interest you quickly.',
      placement: 'bottom',
    },
    {
      target: '[data-onboarding="market-card"]',
      title: '📈 Market Cards',
      content: 'Each card shows market details, current prices, volume, and more. Use the buttons to analyze, save, or set alerts.',
      placement: 'top',
    },
    {
      target: '[data-onboarding="watchlist"]',
      title: '⭐ Save to Watchlist',
      content: 'Click the star icon to save markets you\'re interested in. Access them anytime from the Watchlist page.',
      placement: 'left',
    },
    {
      target: '[data-onboarding="alerts"]',
      title: '🔔 Price Alerts',
      content: 'Set alerts to get notified when prices hit your target. You\'ll receive email notifications when alerts trigger.',
      placement: 'left',
    },
    {
      target: '[data-onboarding="ai-analysis"]',
      title: '🤖 AI Analysis',
      content: 'Get AI-powered insights and recommendations for any market. Understand market dynamics with intelligent analysis.',
      placement: 'top',
    },
    {
      target: '[data-onboarding="wallet"]',
      title: '💼 Connect Your Wallet',
      content: 'Connect your wallet or use email login to access all features. Save markets, set alerts, and track your activity.',
      placement: 'left',
    },
  ]

  const calculateTooltipPosition = useCallback((element: HTMLElement, placement: string) => {
    if (!element || !tooltipRef.current) return { top: 0, left: 0 }

    const tooltip = tooltipRef.current
    const tooltipRect = tooltip.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Tooltip dimensions (approximate, will be updated after render)
    const tooltipWidth = 320
    const tooltipHeight = 200
    const offset = 16

    let top = 0
    let left = 0

    if (placement === 'center') {
      // Center of viewport
      top = viewportHeight / 2 + scrollY
      left = viewportWidth / 2 + scrollX
      return { top, left }
    }

    // Calculate based on placement
    switch (placement) {
      case 'top':
        top = elementRect.top + scrollY - tooltipHeight - offset
        left = elementRect.left + scrollX + elementRect.width / 2
        break
      case 'bottom':
        top = elementRect.bottom + scrollY + offset
        left = elementRect.left + scrollX + elementRect.width / 2
        break
      case 'left':
        top = elementRect.top + scrollY + elementRect.height / 2
        left = elementRect.left + scrollX - tooltipWidth - offset
        break
      case 'right':
        top = elementRect.top + scrollY + elementRect.height / 2
        left = elementRect.right + scrollX + offset
        break
    }

    // Keep tooltip within viewport bounds
    const padding = 16
    
    // Horizontal constraints
    if (left < padding) {
      left = padding
    } else if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding
    }

    // Vertical constraints
    if (top < padding + scrollY) {
      top = padding + scrollY
    } else if (top + tooltipHeight > viewportHeight + scrollY - padding) {
      top = viewportHeight + scrollY - tooltipHeight - padding
    }

    return { top, left }
  }, [])

  const handleComplete = useCallback(() => {
    setIsVisible(false)
    setCurrentStep(0)
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  const updateStep = useCallback(() => {
    const step = steps[currentStep]
    if (!step) {
      handleComplete()
      return
    }

    if (step.placement === 'center') {
      setTargetElement(null)
      const centerPos = {
        top: window.innerHeight / 2 + window.scrollY,
        left: window.innerWidth / 2 + window.scrollX,
      }
      setTooltipPosition(centerPos)
      setIsVisible(true)
      return
    }

    const element = document.querySelector(step.target) as HTMLElement
    if (element) {
      setTargetElement(element)
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      })

      // Wait for scroll to complete, then position tooltip
      setTimeout(() => {
        const pos = calculateTooltipPosition(element, step.placement)
        setTooltipPosition(pos)
        setIsVisible(true)
      }, 300)
    } else {
      // Element not found, skip to next step
      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setIsVisible(false)
          setCurrentStep(currentStep + 1)
        }, 100)
      } else {
        handleComplete()
      }
    }
  }, [currentStep, steps, calculateTooltipPosition, handleComplete])

  useEffect(() => {
    updateStep()
    
    const handleResize = () => {
      if (targetElement) {
        const step = steps[currentStep]
        if (step) {
          const pos = calculateTooltipPosition(targetElement, step.placement)
          setTooltipPosition(pos)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    }
  }, [updateStep, targetElement, currentStep, steps, calculateTooltipPosition, handleComplete])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 200)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
      }, 200)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible || currentStep >= steps.length) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] transition-opacity"
        onClick={handleSkip}
      />

      {/* Spotlight on target element */}
      {targetElement && step.placement !== 'center' && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-blue-500 rounded-lg"
          style={{
            top: targetElement.getBoundingClientRect().top + window.scrollY - 2,
            left: targetElement.getBoundingClientRect().left + window.scrollX - 2,
            width: targetElement.getBoundingClientRect().width + 4,
            height: targetElement.getBoundingClientRect().height + 4,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] w-80 max-w-[calc(100vw-32px)] bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 transition-all"
        style={{
          top: step.placement === 'center' 
            ? `${tooltipPosition.top}px` 
            : `${tooltipPosition.top}px`,
          left: step.placement === 'center'
            ? `${tooltipPosition.left}px`
            : `${tooltipPosition.left}px`,
          transform: step.placement === 'center'
            ? 'translate(-50%, -50%)'
            : step.placement === 'left' || step.placement === 'right'
            ? 'translateY(-50%)'
            : 'translateX(-50%)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {step.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="ml-2 h-6 w-6 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {!isFirst && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="text-sm polycaster-gradient hover:opacity-90 text-white"
          >
            {isLast ? 'Finish' : 'Next'}
            {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </>,
    document.body
  )
}
