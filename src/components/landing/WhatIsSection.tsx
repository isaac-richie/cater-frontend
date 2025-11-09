'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Brain, 
  BarChart3, 
  Zap,
  Shield
} from 'lucide-react'

export function WhatIsSection() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What is <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PolyCaster</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            An analytics and insights platform for Polymarket prediction markets. 
            Get AI-powered signals, track your favorite markets, and never miss important price movements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI-Powered Analysis',
              description: 'Get intelligent insights and recommendations on prediction markets using advanced AI models',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: BarChart3,
              title: 'Market Analytics',
              description: 'Track market trends, volume, liquidity, and price movements in real-time',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: Zap,
              title: 'Smart Alerts',
              description: 'Set price alerts and get notified via email when markets hit your target prices',
              color: 'from-orange-500 to-red-500'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Connect with your wallet or email. Your data is secure and private',
              color: 'from-green-500 to-emerald-500'
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
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

