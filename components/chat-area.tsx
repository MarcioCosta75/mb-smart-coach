"use client"

import type React from "react"
import { ChatMessage, type Message } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"

interface ChatAreaProps {
  messages: Message[]
  isTyping: boolean
  formatTime: (date: Date) => string
  className?: string
  messagesEndRef?: React.RefObject<HTMLDivElement | null>
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

export function ChatArea({ messages, isTyping, formatTime, className = "", messagesEndRef, onScroll }: ChatAreaProps) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      <div 
        className="w-full h-full overflow-y-scroll overflow-x-hidden px-4 py-4"
        onScroll={onScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#94a3b8 rgba(71, 85, 105, 0.3)'
        }}
      >
        {messages.length > 0 ? (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                formatTime={formatTime}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/60">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs text-white/40 mt-1">Start a conversation below</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 12px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 6px;
          margin: 4px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
          background-clip: content-box;
        }
        
        div::-webkit-scrollbar-thumb:active {
          background: #e2e8f0;
          background-clip: content-box;
        }
      `}</style>
    </div>
  )
} 