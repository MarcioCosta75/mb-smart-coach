"use client"

import type React from "react"
import { RefreshCw } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

interface CarDisplayProps {
  model?: string
  lastUpdated?: string
}

export function CarDisplay({ 
  model = "EQS 450+", 
  lastUpdated = "Updated on 07/10/2025 - 07:45" 
}: CarDisplayProps) {
  return (
    <div className="relative z-10 text-center text-white">
      <h2 className="text-xl sm:text-2xl font-light mb-4">{model}</h2>

      <div className="flex items-center justify-center gap-3 mb-6">
        <CustomIcon name="white-lock" width={16} height={23} className="w-4 h-6" />
        <CustomIcon name="parking-icon" width={25} height={17} className="w-6 h-4" />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-8 cursor-pointer hover:opacity-80 transition-opacity">
        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 hover:rotate-180 transition-transform duration-500" />
        <span>{lastUpdated}</span>
      </div>

      {/* Car Image */}
      <div className="mb-6">
        <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
          <CustomIcon name="car-image" width={339} height={149} className="w-full h-auto max-w-[339px] mx-auto" />
        </div>
      </div>
    </div>
  )
} 