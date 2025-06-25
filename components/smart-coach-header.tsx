"use client"

import type React from "react"
import { Menu } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

interface SmartCoachHeaderProps {
  onBack: () => void
}

export function SmartCoachHeader({ onBack }: SmartCoachHeaderProps) {
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
          <div className="text-xs text-gray-300">Intelligent Charging Assistant</div>
        </div>
      </div>
      
      <div className="w-6"></div>
    </div>
  )
} 