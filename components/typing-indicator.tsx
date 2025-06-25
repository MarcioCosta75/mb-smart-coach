"use client"

import type React from "react"

interface TypingIndicatorProps {
  message?: string
}

export function TypingIndicator({ message = "Smart Coach is thinking..." }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-slate-700/90 text-white rounded-2xl rounded-tl-md px-4 py-3 border border-slate-600/50 backdrop-blur-sm shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div 
              className="w-2 h-2 bg-white rounded-full animate-bounce" 
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-white rounded-full animate-bounce" 
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <span className="text-xs text-gray-300">{message}</span>
        </div>
      </div>
    </div>
  )
} 