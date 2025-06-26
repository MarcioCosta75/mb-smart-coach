"use client"

import type React from "react"
import { Menu, Trash2, Volume2 } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

interface SmartCoachHeaderProps {
  onBack: () => void
  onClearChat?: () => void
  isVoiceMode?: boolean
  isProcessing?: boolean
}

export function SmartCoachHeader({ onBack, onClearChat, isVoiceMode, isProcessing }: SmartCoachHeaderProps) {
  return (
    <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          className="text-white hover:scale-110 active:scale-95 transition-transform duration-200"
          onClick={onBack}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 mb-1">
          <CustomIcon name="mercedes-star" className="w-full h-full text-white" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">SMART COACH</div>
          <div className="text-xs text-gray-300 flex items-center gap-2">
            <span>Intelligent Charging Assistant</span>
            {isVoiceMode && (
              <span className="flex items-center gap-1 text-blue-400">
                <Volume2 className="w-3 h-3" />
                <span className={`${isProcessing ? 'animate-pulse' : ''}`}>
                  {isProcessing ? 'Speaking...' : 'Voice Mode'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        {onClearChat && (
          <button 
            className="text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 p-1"
            onClick={onClearChat}
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <div className="w-6"></div>
      </div>
    </div>
  )
} 