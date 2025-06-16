"use client"

import type React from "react"

import { useState } from "react"
import { Menu, MessageCircle, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomIcon } from "@/components/custom-icon"

interface SmartCoachPageProps {
  onBack: () => void
}

export function SmartCoachPage({ onBack }: SmartCoachPageProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-700 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <Menu className="w-6 h-6 cursor-pointer" onClick={onBack} />
        <div className="flex items-center gap-3">
          <div className="w-6 h-6">
            <CustomIcon name="mercedes-star" width={24} height={21} className="w-6 h-5" />
          </div>
          <h1 className="text-base sm:text-lg font-medium">SMART COACH</h1>
        </div>
        <div className="w-6 h-6"></div> {/* Spacer for centering */}
      </div>

      {/* Chat Area - Takes up remaining space */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mercedes Star Pattern Background */}
        <div className="absolute inset-0 opacity-15">
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-12 sm:gap-16 h-full p-8 sm:p-12 pt-16 sm:pt-20">
            {Array.from({ length: 70 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <CustomIcon name="mercedes-star" width={16} height={14} className="w-4 h-3.5 text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Chat messages area - currently empty but ready for messages */}
        <div className="relative z-10 h-full p-4">{/* Chat messages would go here */}</div>
      </div>

      {/* Chat Input - Fixed at bottom */}
      <div className="p-4 relative z-20">
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg">
          {/* Two-row layout */}
          <div className="space-y-3">
            {/* Top row: Icons */}
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-gray-400" />
              <Mic className="w-6 h-6 text-gray-400" />
            </div>

            {/* Bottom row: Text input and send button */}
            <div className="flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your prompt here..."
                className="flex-1 border-none bg-transparent text-gray-600 placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
              <Button
                onClick={handleSend}
                className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 p-0 flex-shrink-0"
              >
                <div className="w-6 h-6">
                  <CustomIcon name="mercedes-star" width={24} height={21} className="w-6 h-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
