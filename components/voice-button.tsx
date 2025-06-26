"use client"

import type React from "react"
import { Mic, MicOff } from "lucide-react"

interface VoiceButtonProps {
  isRecording: boolean
  isDisabled: boolean
  onClick: () => void
}

export function VoiceButton({ isRecording, isDisabled, onClick }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
        isRecording
          ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  )
} 