'use client'

import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  featureDescription?: string
  proBenefits?: string[]
}

export function ComingSoonModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  proBenefits = []
}: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {featureName}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Coming Soon
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {featureDescription && (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {featureDescription}
            </p>
          )}

          {proBenefits.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                This Pro feature will include:
              </p>
              <ul className="space-y-2">
                {proBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              This feature is part of our <span className="font-semibold text-blue-600 dark:text-blue-400">Pro tier</span> and will be available soon!
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onClose}
            className="flex-1"
            variant="outline"
          >
            Got it
          </Button>
          <Button
            onClick={() => {
              onClose()
              // Scroll to footer or pricing section if exists
              const footer = document.querySelector('footer')
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="flex-1 polycaster-gradient text-white"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

