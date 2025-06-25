"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { HeroSection } from "@/components/hero-section"
import { MainContent } from "@/components/main-content"
import { suppressDevWarnings } from "@/lib/dev-utils"
import type { Control, Task } from "@/components/main-content"

export default function HomePage() {
  const router = useRouter()
  const [vehicleUnlocked, setVehicleUnlocked] = useState(true)

  // Suprimir avisos de desenvolvimento
  useEffect(() => {
    suppressDevWarnings()
  }, [])

  const tasks: Task[] = [
    {
      id: "charging",
      type: "charging",
      status: "Charging",
      duration: "2hr",
      progress: 35
    },
    {
      id: "notification",
      type: "notification",
      status: "Notification",
      message: "It is sunny today, you should charge your car for less. It's a good deal!"
    },
    {
      id: "parking",
      type: "parking",
      status: "Parked",
      duration: "1hr",
      progress: 85
    }
  ]

  const controls: Control[] = [
    { icon: "lock", label: "Unlocked", active: true },
    { icon: "door", label: "Closed", active: false },
    { icon: "control", label: "Closed", active: false },
    { icon: "fan", label: "Off", active: false },
  ]

  const handleControlClick = (index: number) => {
    console.log(`Control ${index} clicked`)
  }

  const handleSmartCoachClick = () => {
    router.push("/smart-coach")
  }

  const handleMessagesClick = () => {
    router.push("/smart-coach")
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <AppHeader onMessagesClick={handleMessagesClick} />

      {/* Main Content */}
      <div className="relative">
        {/* Hero Section with Car */}
        <HeroSection />

        {/* Content Section */}
        <MainContent
          tasks={tasks}
          controls={controls}
          vehicleUnlocked={vehicleUnlocked}
          onSmartCoachClick={handleSmartCoachClick}
          onControlClick={handleControlClick}
        />
      </div>
    </div>
  )
}
