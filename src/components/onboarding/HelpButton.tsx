'use client'

import { Button } from '@/components/ui/button'
import { HelpCircle, GraduationCap, BookOpen } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HelpButtonProps {
  onStartTour: () => void
}

export function HelpButton({ onStartTour }: HelpButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onStartTour} className="cursor-pointer">
          <GraduationCap className="w-4 h-4 mr-2" />
          Start Tour
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            FAQ & Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open('https://polycaster.com/docs', '_blank')}
          className="cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Documentation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

