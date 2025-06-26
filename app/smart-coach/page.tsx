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
import { usePersistentChat } from "@/hooks/use-persistent-chat"
import { ConfirmationModal } from "@/components/confirmation-modal"

export default function SmartCoachPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [showClearModal, setShowClearModal] = useState(false)

  // Hooks
  const { voiceState, startRecording, stopRecording, stopAll, clearError, toggleVoiceMode, speakText } = useVoiceChat()
  const { messages, isLoaded, addMessage, clearMessages, getChatHistory } = usePersistentChat()

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

  // Mostrar notificação quando mensagens são carregadas
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      console.log('✅ Conversation restored with', messages.length, 'messages')
    }
  }, [isLoaded, messages.length])

  // Send welcome message for first-time users (when there are 0 messages)
  useEffect(() => {
    if (isLoaded && messages.length === 0) {
      const sendWelcomeMessage = async () => {
        console.log('👋 Sending welcome message for first-time user')
        
        const welcomeMessage: Message = {
          id: `bot-welcome-${Date.now()}`,
          type: 'bot',
          content: `Good morning, Ella! 🌅

Your EQS is at **74% charge** with **504km range**. Perfect for your home office day and any last-minute meetings that might pop up.

I'm your Smart Coach, here to optimize your charging with your solar panels and Mercedes wallbox. I'll help you:

- ☀️ **Maximize solar charging** when Stuttgart's sun is shining
- 💰 **Save on energy costs** with smart off-peak scheduling  
- ⚡ **Never worry about range** - I'll alert you before any trips
- 📅 **Adapt to your plans** - just like your flexible work style

What can I help you with today?`,
          timestamp: new Date()
        }
        
        addMessage(welcomeMessage)

        // 🔊 SEMPRE reproduzir a mensagem de boas-vindas em áudio para novos usuários
        try {
          console.log('🗣️ Speaking welcome message for first-time user')
          await speakText(welcomeMessage.content)
        } catch (error) {
          console.error('❌ Error speaking welcome message:', error)
          // Falha silenciosa - não bloqueia a experiência se houver erro de áudio
        }
      }
      
      // Add a small delay to make it feel natural
      const timer = setTimeout(sendWelcomeMessage, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, messages.length, addMessage, speakText])

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
        addMessage(userMessage)
        
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
              history: getChatHistory()
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

          addMessage(botMessage)
          
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
          addMessage(errorMessage)
          
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

    addMessage(userMessage)
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
          history: getChatHistory()
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

      addMessage(botMessage)

      // 🔊 NOVA FUNCIONALIDADE: Se estiver no modo de voz, reproduzir a resposta automaticamente
      if (voiceState.isVoiceMode && !voiceState.isPlaying) {
        try {
          console.log('🗣️ Auto-speaking response in voice mode')
          await speakText(botMessage.content)
        } catch (error) {
          console.error('❌ Error auto-speaking response:', error)
        }
      }

    } catch (error) {
      console.error('❌ Chat API Error:', error)
      
      // Fallback response on error
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      }
      addMessage(errorMessage)

      // Reproduzir mensagem de erro em modo de voz também
      if (voiceState.isVoiceMode && !voiceState.isPlaying) {
        try {
          await speakText(errorMessage.content)
        } catch (speakError) {
          console.error('❌ Error speaking error message:', speakError)
        }
      }
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

  const handleClearChat = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    clearMessages()
    setShowClearModal(false)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-700 to-slate-900 z-50 flex flex-col overflow-hidden">
      <SmartCoachHeader 
        onBack={handleBack} 
        onClearChat={handleClearChat}
        isVoiceMode={voiceState.isVoiceMode}
        isProcessing={voiceState.isProcessing || voiceState.isPlaying}
      />

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
          {!isLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto mb-2"></div>
                <p className="text-sm">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <ChatArea
              messages={messages}
              isTyping={isTyping}
              formatTime={formatTime}
              messagesEndRef={messagesEndRef}
              onScroll={handleScroll}
            />
          )}
        </div>
      </div>

      {/* Fixed Chat Input */}
      <div className="relative z-20">
        <ChatInput
          message={message}
          isTyping={isTyping}
          isRecording={voiceState.isRecording}
          isVoiceMode={voiceState.isVoiceMode}
          onMessageChange={setMessage}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          onVoiceClick={handleVoiceClick}
          onToggleVoiceMode={toggleVoiceMode}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Clear Conversation"
        message="Are you sure you want to clear the entire conversation history? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
} 