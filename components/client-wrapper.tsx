"use client"

import type React from "react"
import { useEffect } from "react"

interface ClientWrapperProps {
  children: React.ReactNode
  className?: string
}

export function ClientWrapper({ children, className = "" }: ClientWrapperProps) {
  useEffect(() => {
    // Suppress specific React DevTools development warnings
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args[0]
        if (
          typeof message === 'string' &&
          (message.includes('Download the React DevTools') ||
           message.includes('Skipping auto-scroll behavior'))
        ) {
          return
        }
        originalWarn.apply(console, args)
      }
    }
  }, [])

  return (
    <div className={className} suppressHydrationWarning>
      {children}
    </div>
  )
} 