'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  TrendingUp, 
  Bell, 
  Target,
  BookOpen
} from 'lucide-react'

export function UseCasesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How to Use PolyCaster
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you&apos;re tracking markets, setting alerts, or making informed decisions, 
            PolyCaster helps you stay ahead
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Discover Markets',
              description: 'Browse thousands of prediction markets across crypto, politics, sports, and more. Use our powerful search and filters to find exactly what you\'re looking for.',
              steps: [
                'Browse by category or search',
                'Filter by price, volume, status',
                'Save favorites to your watchlist'
              ]
            },
            {
              icon: Target,
              title: 'Get AI Insights',
              description: 'Get AI-powered analysis on any market. Understand market sentiment, risk levels, and get buy/sell/hold recommendations.',
              steps: [
                'Click "AI" on any market card',
                'Review analysis and recommendations',
                'Make informed decisions'
              ]
            },
            {
              icon: Bell,
              title: 'Set Price Alerts',
              description: 'Never miss important price movements. Set alerts for when markets hit your target prices and get notified via email.',
              steps: [
                'Click the bell icon on any market',
                'Set your target price and condition',
                'Get notified when triggered'
              ]
            },
            {
              icon: TrendingUp,
              title: 'Track Performance',
              description: 'Calculate ROI, track your watchlist, and review your signal purchase history. All your data in one place.',
              steps: [
                'Use ROI calculator for positions',
                'Monitor your watchlist',
                'Review signal history'
              ]
            },
          ].map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {useCase.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {useCase.description}
                        </p>
                        <ul className="space-y-2">
                          {useCase.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-blue-500 font-bold mt-1">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

