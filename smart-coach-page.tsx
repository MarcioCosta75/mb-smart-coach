"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Menu, MessageCircle, Mic, Send, Zap, MapPin, Clock, Battery, DollarSign, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomIcon } from "@/components/custom-icon"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface SmartCoachPageProps {
  onBack: () => void
}

// Quick action suggestions for smart charging
const quickActionCategories = {
  charging: ["Optimize charging schedule", "Set battery limit", "Find AC charging"],
  location: ["Locate nearby stations", "Check availability", "Reserve spot"],
  costs: ["Find cheapest charging", "Schedule off-peak", "Compare prices"],
  planning: ["Plan a trip", "Check route", "Weather impact"],
  battery: ["Check battery health", "View statistics", "Health tips"],
  green: ["Green energy options", "Solar charging", "Carbon tracking"]
}

const quickSuggestions = [
  { icon: Zap, text: "Optimize charging schedule", category: "charging" },
  { icon: DollarSign, text: "Find cheapest charging", category: "cost" },
  { icon: MapPin, text: "Locate nearby stations", category: "location" },
  { icon: Clock, text: "Set charging timer", category: "schedule" },
  { icon: Battery, text: "Check battery health", category: "battery" },
  { icon: Sun, text: "Green energy options", category: "green" }
]

export function SmartCoachPage({ onBack }: SmartCoachPageProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [messageIdCounter, setMessageIdCounter] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Send welcome message on mount using API route
    const loadWelcomeMessage = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: "Hello",
            history: []
          })
        })

        if (response.ok) {
          const apiResponse = await response.json()
          const welcomeMessage: Message = {
            id: "welcome-1",
            type: 'bot',
            content: apiResponse.message,
            timestamp: new Date(),
            suggestions: apiResponse.suggestions || ["Optimize my charging", "Find charging stations", "Check energy prices", "Plan a trip"]
          }
          setMessages([welcomeMessage])
          setMessageIdCounter(2)
        } else {
          throw new Error('API request failed')
        }
      } catch (error) {
        console.error('Error loading welcome message:', error)
        
        // Fallback welcome message
        const welcomeMessage: Message = {
          id: "welcome-1",
          type: 'bot',
          content: "Hello! I'm your Mercedes Smart Charging Coach. How can I help you optimize your EQS charging today?",
          timestamp: new Date(),
          suggestions: ["Optimize my charging", "Find charging stations", "Check energy prices", "Plan a trip"]
        }
        setMessages([welcomeMessage])
        setMessageIdCounter(2)
      }
    }
    
    loadWelcomeMessage()
  }, [])



  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || message.trim()
    if (!textToSend) return

    // Add user message
    const currentId = messageIdCounter
    const userMessage: Message = {
      id: `user-${currentId}`,
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setShowSuggestions(false)
    setIsTyping(true)

    try {
      // Convert messages to chat history format
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant' as const,
        content: msg.content,
        timestamp: msg.timestamp
      }))

      // Use API route for chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      })

      if (response.ok) {
        const apiResponse = await response.json()
        
        const botMessage: Message = {
          id: `bot-${currentId + 1}`,
          type: 'bot',
          content: apiResponse.message,
          timestamp: new Date(),
          suggestions: apiResponse.suggestions || ["Tell me more", "Show alternatives", "Set reminder"]
        }
        
        setMessages(prev => [...prev, botMessage])
        setMessageIdCounter(currentId + 2)
        setIsTyping(false)
      } else {
        throw new Error(`API request failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback response
      const fallbackMessage: Message = {
        id: `bot-${currentId + 1}`,
        type: 'bot',
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        suggestions: ["Try again", "Contact support", "Check connection"]
      }
      
      setMessages(prev => [...prev, fallbackMessage])
      setMessageIdCounter(currentId + 2)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-700 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <Menu 
          className="w-6 h-6 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200" 
          onClick={onBack} 
        />
        <div className="flex items-center gap-3">
          <div className="w-6 h-6">
            <CustomIcon name="mercedes-star" width={24} height={21} className="w-6 h-5" />
          </div>
          <div className="text-center">
            <h1 className="text-base sm:text-lg font-medium">SMART COACH</h1>
            <p className="text-xs text-gray-300">Intelligent Charging Assistant</p>
          </div>
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mercedes Star Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-12 sm:gap-16 h-full p-8 sm:p-12 pt-16 sm:pt-20">
            {Array.from({ length: 70 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <CustomIcon name="mercedes-star" width={16} height={14} className="w-4 h-3.5 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatAreaRef}
          className="relative z-10 h-full overflow-y-auto px-3 sm:px-4 pt-6 sm:pt-4 pb-6"
        >
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ${index === 0 ? 'mt-6 sm:mt-4' : ''}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] md:max-w-[70%] rounded-2xl px-3 sm:px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-white text-gray-800 rounded-tr-md'
                      : 'bg-gray-800 text-white rounded-tl-md border border-gray-600'
                  }`}
                >
                  <div className="space-y-2">
                    {msg.type === 'bot' ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                            code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            pre: ({ children }) => <pre className="bg-gray-700 p-2 rounded mt-2 overflow-x-auto text-xs">{children}</pre>,
                            h1: ({ children }) => <h1 className="text-base font-semibold mb-2 text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-medium mb-1 text-white">{children}</h3>,
                            blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-600 pl-3 italic text-gray-300">{children}</blockquote>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                    
                    {/* Suggestions for bot messages */}
                    {msg.type === 'bot' && msg.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full transition-colors duration-200 border border-gray-600"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs ${msg.type === 'user' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-white rounded-2xl rounded-tl-md px-4 py-3 border border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400">Smart Coach is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-3 border border-gray-600">
            <p className="text-white text-sm mb-3 font-medium">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                >
                  <suggestion.icon className="w-4 h-4" />
                  <span className="truncate">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 sm:p-4 relative z-20">
        <div className="w-full bg-white rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200">
          <div className="space-y-3">
            {/* Top row: Icons */}
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              <Mic className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              <div className="flex-1 flex justify-end">
                <span className="text-xs text-gray-400">
                  {messages.filter(m => m.type === 'user').length} messages sent
                </span>
              </div>
            </div>

            {/* Bottom row: Text input and send button */}
            <div className="flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about charging, costs, stations, or trip planning..."
                className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!message.trim() || isTyping}
                className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 p-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <div className="w-6 h-6">
                  <CustomIcon name="mercedes-star" width={24} height={21} className="w-6 h-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
