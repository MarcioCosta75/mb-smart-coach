"use client"

import type React from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomIcon } from "@/components/custom-icon"
import { VoiceButton } from "@/components/voice-button"

interface ChatInputProps {
  message: string
  isTyping: boolean
  isRecording: boolean
  isVoiceMode: boolean
  onMessageChange: (value: string) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onVoiceClick: () => void
  onToggleVoiceMode: () => void
}

export function ChatInput({
  message,
  isTyping,
  isRecording,
  isVoiceMode,
  onMessageChange,
  onSend,
  onKeyPress,
  onVoiceClick,
  onToggleVoiceMode
}: ChatInputProps) {
  return (
    <div className="p-4">
      <div className="w-full bg-white rounded-2xl p-4 shadow-xl border border-gray-200">
        {/* Linha única com input e controles */}
        <div className="flex items-center gap-3">
          {/* Input principal */}
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your prompt here..."
            className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm font-medium"
            disabled={isTyping}
          />

          {/* Controles compactos à direita */}
          <div className="flex items-center gap-2">
            {/* Toggle modo de voz - compacto */}
            <Button
              onClick={onToggleVoiceMode}
              variant="ghost"
              size="sm"
              className={`p-1.5 h-7 w-7 transition-all duration-200 rounded-full ${
                isVoiceMode 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isVoiceMode ? "Voice mode ON" : "Voice mode OFF"}
            >
              {isVoiceMode ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </Button>

            {/* Botão de voz - compacto */}
            <VoiceButton
              isRecording={isRecording}
              isDisabled={isTyping}
              onClick={onVoiceClick}
            />

            {/* Botão enviar */}
            <Button
              onClick={onSend}
              disabled={!message.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 p-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              <div className="w-5 h-5">
                <CustomIcon name="mercedes-star" width={20} height={18} className="w-5 h-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 