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
    <div className="relative">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-6 h-6 transition-all duration-200 ${
          isRecording
            ? 'text-red-500 animate-pulse'
            : 'text-gray-400 hover:text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  )
} 