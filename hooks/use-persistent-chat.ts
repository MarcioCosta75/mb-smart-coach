import { useState, useEffect } from 'react'
import type { Message } from '@/components/chat-message'

interface ChatSession {
  messages: Message[]
  lastUpdated: Date
}

export function usePersistentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('smart-coach-chat-session')
    if (savedSession) {
      try {
        const session: ChatSession = JSON.parse(savedSession)
        // Convert timestamp strings back to Date objects
        const messagesWithDates = session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
        console.log('📥 Loaded chat session from localStorage:', messagesWithDates.length, 'messages')
      } catch (error) {
        console.error('❌ Error loading chat session:', error)
        // Clear corrupted data
        localStorage.removeItem('smart-coach-chat-session')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (isLoaded) {
      const session: ChatSession = {
        messages,
        lastUpdated: new Date()
      }
      localStorage.setItem('smart-coach-chat-session', JSON.stringify(session))
      console.log('💾 Saved chat session to localStorage:', messages.length, 'messages')
    }
  }, [messages, isLoaded])

  // Function to add a new message
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  // Function to clear all messages
  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('smart-coach-chat-session')
    console.log('🗑️ Cleared chat session')
  }

  // Function to get chat history for API calls
  const getChatHistory = () => {
    return messages.map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
      timestamp: msg.timestamp
    }))
  }

  return {
    messages,
    isLoaded,
    addMessage,
    clearMessages,
    getChatHistory,
    setMessages // Keep the direct setter for bulk operations
  }
} 