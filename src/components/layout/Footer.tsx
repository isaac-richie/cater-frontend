'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Twitter, ExternalLink } from 'lucide-react'
import { RobotLogo } from '@/components/ui/RobotLogo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-800 dark:to-blue-950 border border-blue-500/30">
                <RobotLogo className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PolyCaster
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-Powered Insights for Prediction Markets
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Discover, analyze, and track Polymarket markets with intelligent AI signals
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Markets
                </Link>
              </li>
              <li>
                <Link 
                  href="/watchlist" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link 
                  href="/alerts" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Price Alerts
                </Link>
              </li>
              <li>
                <Link 
                  href="/history" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Signal History
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Help & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://x.com/polycaster"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                title="Follow us on X (Twitter)"
              >
                <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </motion.a>
              <motion.a
                href="https://github.com/isaac-richie/casterz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors group"
                title="View on GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </motion.a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Follow us for updates and announcements
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center sm:text-left">
              © {currentYear} PolyCaster. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <Link 
                href="/help" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Help
              </Link>
              <span>•</span>
              <a 
                href="https://polymarket.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Polymarket
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

