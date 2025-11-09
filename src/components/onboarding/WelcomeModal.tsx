'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Star, 
  Bell, 
  Target, 
  Calculator, 
  TrendingUp,
  Zap,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onStartTour: () => void
}

export function WelcomeModal({ isOpen, onClose, onStartTour }: WelcomeModalProps) {

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find markets instantly with real-time search',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Star,
      title: 'Watchlist',
      description: 'Save your favorite markets for quick access',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when prices hit your targets',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: Target,
      title: 'AI Analysis',
      description: 'Get intelligent insights and recommendations',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Calculator,
      title: 'ROI Calculator',
      description: 'Calculate potential returns before investing',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track market trends and volume changes',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ]


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to PolyCaster! 🚀
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Your AI-powered analytics platform for Polymarket prediction markets
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover, analyze, and track prediction markets with intelligent insights
            </p>
          </motion.div>

          {/* Features Grid */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${feature.bgColor} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onStartTour}
              className="flex-1 polycaster-gradient hover:opacity-90 text-white py-6 text-lg font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Interactive Tour
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 py-6 text-lg font-semibold"
            >
              Skip & Explore
            </Button>
          </div>

          {/* Tip */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> You can always access this tour from the help menu or start it again anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

