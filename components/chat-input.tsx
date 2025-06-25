"use client"

import type React from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomIcon } from "@/components/custom-icon"
import { VoiceButton } from "@/components/voice-button"

interface ChatInputProps {
  message: string
  isTyping: boolean
  isRecording: boolean
  onMessageChange: (value: string) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onVoiceClick: () => void
}

export function ChatInput({
  message,
  isTyping,
  isRecording,
  onMessageChange,
  onSend,
  onKeyPress,
  onVoiceClick
}: ChatInputProps) {
  return (
    <div className="p-4">
      <div className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-200">
        <div className="space-y-3">
          {/* Top row: Icons */}
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
            
            <VoiceButton
              isRecording={isRecording}
              isDisabled={isTyping}
              onClick={onVoiceClick}
            />

            <div className="flex-1 flex justify-end">
              <span className="text-xs text-gray-400 font-medium">
                Start conversation
              </span>
            </div>
          </div>

          {/* Bottom row: Text input and send button */}
          <div className="flex items-center gap-3">
            <Input
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Type your prompt here..."
              className="flex-1 border-none bg-transparent text-gray-400 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm font-medium"
              disabled={isTyping}
            />
            <Button
              onClick={onSend}
              disabled={!message.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 p-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <div className="w-6 h-6">
                <CustomIcon name="mercedes-star" width={24} height={21} className="w-6 h-5" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 