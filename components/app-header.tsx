"use client"

import type React from "react"
import { Menu } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

interface AppHeaderProps {
  onMessagesClick: () => void
}

export function AppHeader({ onMessagesClick }: AppHeaderProps) {
  return (
    <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <Menu className="w-6 h-6 cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200" />
      <h1 className="text-lg sm:text-xl font-medium">Mercedes-Benz</h1>
      <div
        className="relative cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200"
        onClick={onMessagesClick}
      >
        <CustomIcon name="messages" width={35} height={27} className="w-8 h-6 sm:w-[35px] sm:h-[27px]" />
      </div>
    </div>
  )
} 