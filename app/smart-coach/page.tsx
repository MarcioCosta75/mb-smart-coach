"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { SmartCoachHeader } from "@/components/smart-coach-header"
import { SmartCoachDrawer } from "@/components/smart-coach-drawer"
import { ChatArea } from "@/components/chat-area"
import { ChatInput } from "@/components/chat-input"
import { suppressDevWarnings } from "@/lib/dev-utils"
import type { ScheduleItem, NotificationItem } from "@/components/smart-coach-drawer"
import type { Message } from "@/components/chat-message"
import { useVoiceChat } from "@/hooks/use-voice-chat"

export default function SmartCoachPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  // Hooks
  const { voiceState, startRecording, stopRecording, stopAll, clearError } = useVoiceChat()

  // Suprimir avisos de desenvolvimento
  useEffect(() => {
    suppressDevWarnings()
  }, [])

  // Auto-scroll inteligente - só quando o usuário está próximo do final
  useEffect(() => {
    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isNearBottom])

  // Detectar se o usuário está próximo do final do scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100 // 100px de threshold
    setIsNearBottom(isAtBottom)
  }

  // Sample data
  const scheduleItems: ScheduleItem[] = [
    {
      id: "1",
      time: "10:00 a.m",
      task: "Charging",
      duration: "2hr",
      icon: "charging"
    },
    {
      id: "2", 
      time: "04:00 p.m",
      task: "Charging",
      duration: "1hr5min",
      icon: "charging"
    }
  ]

  const notificationItems: NotificationItem[] = [
    {
      id: "1",
      message: "It is sunny today, you should charge your car for less. It's a good deal!",
      timeAgo: "2mins ago",
      icon: "sun"
    },
    {
      id: "2",
      message: "I see a long trip in your schedule. You should charge today to prepare for trip.",
      timeAgo: "3days ago", 
      icon: "nav"
    }
  ]

  const handleVoiceClick = async () => {
    if (voiceState.isRecording) {
      const handleTranscript = async (transcript: string): Promise<string> => {
        console.log('🎤 Voice Transcript:', transcript)
        
        // Add user voice message to chat
        const userMessage: Message = {
          id: `user-voice-${Date.now()}`,
          type: 'user',
          content: transcript,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        
        try {
          // Call the real Chat API with the transcript
          console.log('🚀 Sending voice transcript to Smart Coach API...')
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: transcript,
              history: messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content,
                timestamp: msg.timestamp
              }))
            })
          })

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
          }

          const data = await response.json()
          console.log('✅ Received Smart Coach voice response:', data)

          const botMessage: Message = {
            id: `bot-voice-${Date.now()}`,
            type: 'bot',
            content: data.message || "I'm here to help with your Mercedes Smart Coach needs!",
            timestamp: new Date()
          }

          setMessages(prev => [...prev, botMessage])
          
          // Return the response text for TTS
          return data.message || "I'm here to help with your Mercedes Smart Coach needs!"
          
        } catch (error) {
          console.error('❌ Voice Chat API Error:', error)
          const errorResponse = "I'm experiencing some technical difficulties with voice processing. Please try again."
          
          const errorMessage: Message = {
            id: `bot-voice-error-${Date.now()}`,
            type: 'bot',
            content: errorResponse,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
          
          return errorResponse
        }
      }
      await stopRecording(handleTranscript)
    } else {
      await startRecording()
    }
  }

  const handleSend = async () => {
    if (!message.trim() || isTyping) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    try {
      // Call the real Chat API with OpenAI
      console.log('🚀 Sending message to Smart Coach API...')
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
            timestamp: msg.timestamp
          }))
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Received Smart Coach response:', data)

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: data.message || "I'm here to help with your Mercedes Smart Coach needs!",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('❌ Chat API Error:', error)
      
      // Fallback response on error
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-700 to-slate-900 z-50 flex flex-col overflow-hidden">
      <SmartCoachHeader onBack={handleBack} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Smart Coach Drawer - Always Present */}
        <SmartCoachDrawer
          isExpanded={isDrawerExpanded}
          onToggle={() => setIsDrawerExpanded(!isDrawerExpanded)}
          scheduleItems={scheduleItems}
          notificationItems={notificationItems}
        />

        {/* Chat Messages Area - Always Present */}
        <div className="flex-1 relative min-h-0">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
          />
        </div>
      </div>

      {/* Fixed Chat Input */}
      <div className="relative z-20">
        <ChatInput
          message={message}
          isTyping={isTyping}
          isRecording={voiceState.isRecording}
          onMessageChange={setMessage}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          onVoiceClick={handleVoiceClick}
        />
      </div>
    </div>
  )
} 