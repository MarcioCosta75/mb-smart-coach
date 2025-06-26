"use client"

import type React from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
        <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${message.type === 'user' ? 'text-gray-800' : 'text-white'}`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className={`font-semibold ${message.type === 'user' ? 'text-gray-900' : 'text-white'}`}>{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => <code className={`px-1 py-0.5 rounded text-xs font-mono ${message.type === 'user' ? 'bg-gray-100 text-gray-800' : 'bg-slate-600 text-gray-200'}`}>{children}</code>,
              pre: ({ children }) => <pre className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${message.type === 'user' ? 'bg-gray-100 text-gray-800' : 'bg-slate-600 text-gray-200'}`}>{children}</pre>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm">{children}</li>,
              h1: ({ children }) => <h1 className={`text-lg font-bold mb-2 ${message.type === 'user' ? 'text-gray-900' : 'text-white'}`}>{children}</h1>,
              h2: ({ children }) => <h2 className={`text-base font-bold mb-2 ${message.type === 'user' ? 'text-gray-900' : 'text-white'}`}>{children}</h2>,
              h3: ({ children }) => <h3 className={`text-sm font-bold mb-1 ${message.type === 'user' ? 'text-gray-900' : 'text-white'}`}>{children}</h3>,
              blockquote: ({ children }) => <blockquote className={`border-l-4 pl-3 italic ${message.type === 'user' ? 'border-gray-300 text-gray-600' : 'border-slate-500 text-gray-300'}`}>{children}</blockquote>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-gray-500' : 'text-gray-300'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
} 