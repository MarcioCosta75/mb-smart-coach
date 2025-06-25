"use client"

import type React from "react"

export interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  formatTime: (date: Date) => string
}

export function ChatMessage({ message, formatTime }: ChatMessageProps) {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
          message.type === 'user'
            ? 'bg-white text-gray-800 rounded-tr-md'
            : 'bg-slate-700/90 text-white rounded-tl-md border border-slate-600/50 backdrop-blur-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-gray-500' : 'text-gray-300'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
} 