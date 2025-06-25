"use client"

import type React from "react"
import { CarDisplay } from "@/components/car-display"

interface HeroSectionProps {
  model?: string
  lastUpdated?: string
}

export function HeroSection({ model, lastUpdated }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-b from-slate-600 to-slate-400 px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
      <CarDisplay model={model} lastUpdated={lastUpdated} />
    </div>
  )
} 