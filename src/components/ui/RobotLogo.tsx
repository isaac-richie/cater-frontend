'use client'

import { motion } from 'framer-motion'

interface RobotLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

export function RobotLogo({ size = 'md', className = '', animated = false }: RobotLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const RobotIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${sizeClasses[size]} ${className}`}
    >
      {/* Robot Head */}
      <rect
        x="6"
        y="4"
        width="12"
        height="10"
        rx="2"
        fill="currentColor"
        className="text-white drop-shadow-sm"
      />
      
      {/* Antenna */}
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-white"
      />
      
      {/* Antenna Tip */}
      <circle
        cx="12"
        cy="2"
        r="1"
        fill="currentColor"
        className="text-white"
      />
      
      {/* Eyes */}
      <circle
        cx="9"
        cy="8"
        r="1.5"
        fill="currentColor"
        className="text-blue-200"
      />
      <circle
        cx="15"
        cy="8"
        r="1.5"
        fill="currentColor"
        className="text-blue-200"
      />
      
      {/* Eye pupils */}
      <circle
        cx="9"
        cy="8"
        r="0.5"
        fill="currentColor"
        className="text-blue-600"
      />
      <circle
        cx="15"
        cy="8"
        r="0.5"
        fill="currentColor"
        className="text-blue-600"
      />
      
      {/* Smile */}
      <path
        d="M9 11 Q12 13 15 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="text-blue-200"
      />
      
      {/* Side protrusions */}
      <rect
        x="4"
        y="6"
        width="2"
        height="6"
        rx="1"
        fill="currentColor"
        className="text-white"
      />
      <rect
        x="18"
        y="6"
        width="2"
        height="6"
        rx="1"
        fill="currentColor"
        className="text-white"
      />
      
      {/* Body */}
      <rect
        x="8"
        y="14"
        width="8"
        height="6"
        rx="1"
        fill="currentColor"
        className="text-white"
      />
      
      {/* Arms/Legs */}
      <path
        d="M8 16 Q6 18 8 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="text-white"
      />
      <path
        d="M16 16 Q18 18 16 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="text-white"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        className="inline-block"
      >
        <RobotIcon />
      </motion.div>
    )
  }

  return <RobotIcon />
}

export default RobotLogo


