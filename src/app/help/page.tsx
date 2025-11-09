'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  MessageCircle,
  Mail,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'features' | 'alerts' | 'ai' | 'account' | 'technical'
}

const faqData: FAQItem[] = [
  // General
  {
    question: 'What is PolyCaster?',
    answer: 'PolyCaster is an analytics and insights platform for Polymarket prediction markets. We provide AI-powered analysis, price alerts, watchlists, and ROI calculators to help you make informed decisions on prediction markets.',
    category: 'general'
  },
  {
    question: 'Is PolyCaster free to use?',
    answer: 'Yes! Most features are free, including browsing markets, creating watchlists, setting price alerts, and using the ROI calculator. AI analysis requires a small payment per analysis to cover processing costs.',
    category: 'general'
  },
  {
    question: 'Do I need to connect a wallet?',
    answer: 'You can browse markets without connecting a wallet, but to use features like watchlists, price alerts, and AI analysis, you\'ll need to connect a wallet or sign in with email.',
    category: 'general'
  },
  {
    question: 'Is PolyCaster a trading platform?',
    answer: 'No, PolyCaster is an analytics and insights platform. We don\'t offer trading features. You\'ll need to go to Polymarket.com to actually place trades. We help you analyze markets and make informed decisions.',
    category: 'general'
  },

  // Features
  {
    question: 'What is a watchlist?',
    answer: 'A watchlist lets you save your favorite markets for quick access later. You can add notes to each market and easily track them without searching every time.',
    category: 'features'
  },
  {
    question: 'How does the ROI calculator work?',
    answer: 'The ROI calculator helps you estimate potential profit or loss for a position. Enter your investment amount, choose YES or NO position, and see your expected return based on current market prices.',
    category: 'features'
  },
  {
    question: 'Can I filter markets by category?',
    answer: 'Yes! You can filter by categories like Crypto, Politics, Sports, Tech, and more. You can also use advanced filters for price range, volume, and market status.',
    category: 'features'
  },
  {
    question: 'How do I search for markets?',
    answer: 'Use the search bar at the top of the page. Type keywords related to the market you\'re looking for. The search is real-time and will show results as you type.',
    category: 'features'
  },

  // Alerts
  {
    question: 'How do price alerts work?',
    answer: 'Set a target price for any market and choose a condition (above, below, or equals). When the market price reaches your target, you\'ll receive an email notification and an in-app notification.',
    category: 'alerts'
  },
  {
    question: 'How do I set up email notifications?',
    answer: 'Go to the Alerts page and click "Email Settings". Enter your email address and verify it by clicking the link in the verification email we send you.',
    category: 'alerts'
  },
  {
    question: 'Can I set multiple alerts for the same market?',
    answer: 'Yes! You can create multiple alerts with different target prices and conditions for the same market. This is useful for tracking different price levels.',
    category: 'alerts'
  },
  {
    question: 'Why didn\'t I receive an email alert?',
    answer: 'Make sure your email is verified in Email Settings. Also check your spam folder. Alerts only trigger when the market price actually reaches your target price and condition.',
    category: 'alerts'
  },
  {
    question: 'How often are alerts checked?',
    answer: 'Our system checks market prices every 30 seconds. When an alert triggers, you\'ll be notified immediately via email and in-app notification.',
    category: 'alerts'
  },

  // AI
  {
    question: 'What is AI analysis?',
    answer: 'AI analysis provides intelligent insights on prediction markets, including market sentiment, risk assessment, and buy/sell/hold recommendations based on advanced AI models.',
    category: 'ai'
  },
  {
    question: 'How much does AI analysis cost?',
    answer: 'AI analysis requires a small payment to cover processing costs. The exact amount varies but is typically very affordable. You\'ll see the price before confirming the analysis.',
    category: 'ai'
  },
  {
    question: 'Where can I see my AI analysis history?',
    answer: 'Go to the History page (click "History" in the header) to see all your purchased AI signals. You can filter and sort them by date, recommendation, and confidence level.',
    category: 'ai'
  },
  {
    question: 'How accurate is the AI analysis?',
    answer: 'Our AI models analyze market data, trends, and patterns to provide insights. However, prediction markets are inherently uncertain, and past performance doesn\'t guarantee future results. Use AI analysis as one tool in your decision-making process.',
    category: 'ai'
  },

  // Account
  {
    question: 'Can I use email instead of a wallet?',
    answer: 'Yes! You can sign in with email, Google, Apple, or Facebook using our In-App Wallet feature. This creates a wallet for you automatically.',
    category: 'account'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard security practices. Your wallet connection is secure, and we don\'t store your private keys. Email addresses are encrypted and only used for notifications.',
    category: 'account'
  },
  {
    question: 'Can I delete my account?',
    answer: 'Currently, you can remove your watchlist items and alerts manually. For complete account deletion, please contact support.',
    category: 'account'
  },
  {
    question: 'Do you store my wallet private keys?',
    answer: 'No, we never have access to your wallet private keys. When you connect a wallet, we only read your public address. Your keys stay in your wallet.',
    category: 'account'
  },

  // Technical
  {
    question: 'Why are some markets not loading?',
    answer: 'This could be due to network issues or API rate limits. Try refreshing the page. If the problem persists, check your internet connection or try again later.',
    category: 'technical'
  },
  {
    question: 'Is PolyCaster mobile-friendly?',
    answer: 'Yes! PolyCaster is fully responsive and optimized for mobile devices. You can use all features on your phone or tablet.',
    category: 'technical'
  },
  {
    question: 'Do you support dark mode?',
    answer: 'Yes! Click the theme toggle in the header to switch between light and dark modes. Your preference is saved automatically.',
    category: 'technical'
  },
  {
    question: 'How do I report a bug?',
    answer: 'If you encounter a bug, please contact us through the support email or use the contact form. Include details about what happened and what you were trying to do.',
    category: 'technical'
  },
]

const categories = [
  { id: 'all', label: 'All Questions', icon: BookOpen },
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'features', label: 'Features', icon: MessageCircle },
  { id: 'alerts', label: 'Alerts', icon: Mail },
  { id: 'ai', label: 'AI Analysis', icon: MessageCircle },
  { id: 'account', label: 'Account', icon: HelpCircle },
  { id: 'technical', label: 'Technical', icon: HelpCircle },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      newOpen.add(index)
    }
    setOpenItems(newOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Markets
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Help & FAQ
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Find answers to common questions about PolyCaster
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'polycaster-gradient text-white'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No questions found. Try a different search term or category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isOpen = openItems.has(index)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => toggleItem(index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl text-left pr-8">
                          {faq.question}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-600">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Can&apos;t find what you&apos;re looking for? Contact our support team.
              </p>
              <Button
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

