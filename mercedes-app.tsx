"use client"

import { useState } from "react"
import { Menu, RefreshCw } from "lucide-react"
import { SmartCoachPage } from "./smart-coach-page"
import { CustomIcon } from "./components/custom-icon"
import { CurrentTaskCard } from "./components/current-task-card"
import { SmartCoachButton } from "./components/smart-coach-button"
import { BatteryStatus } from "./components/battery-status"
import { RemoteControls } from "./components/remote-controls"
import { VehicleStatus } from "./components/vehicle-status"

export default function Component() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [vehicleUnlocked, setVehicleUnlocked] = useState(true)

  const controls = [
    { icon: "lock", label: "Unlocked", active: true },
    { icon: "door", label: "Closed", active: false },
    { icon: "control", label: "Closed", active: false },
    { icon: "fan", label: "Off", active: false },
  ]

  const handleControlClick = (index: number) => {
    // Handle control interactions
    console.log(`Control ${index} clicked`)
  }

  if (currentPage === "smart-coach") {
    return <SmartCoachPage onBack={() => setCurrentPage("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <Menu className="w-6 h-6 cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200" />
        <h1 className="text-base sm:text-lg font-medium">Mercedes-Benz</h1>
        <div
          className="relative cursor-pointer hover:opacity-80 hover:scale-110 active:scale-95 transition-all duration-200"
          onClick={() => setCurrentPage("smart-coach")}
        >
          <CustomIcon name="messages" width={35} height={27} className="w-8 h-6 sm:w-[35px] sm:h-[27px]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Hero Section with Car */}
        <div className="relative bg-gradient-to-b from-slate-600 to-slate-400 px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
          {/* Mercedes Star Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-8 sm:gap-12 h-full p-4 sm:p-8">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <CustomIcon
                    name="mercedes-star"
                    width={12}
                    height={10}
                    className="w-3 h-2.5 sm:w-3 sm:h-2.5 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-center text-white">
            <h2 className="text-xl sm:text-2xl font-light mb-4">EQS 450+</h2>

            <div className="flex items-center justify-center gap-3 mb-6">
              <CustomIcon name="white-lock" width={16} height={23} className="w-4 h-6" />
              <CustomIcon name="parking-icon" width={25} height={17} className="w-6 h-4" />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-8 cursor-pointer hover:opacity-80 transition-opacity">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 hover:rotate-180 transition-transform duration-500" />
              <span>Updated on 07/10/2025 - 07:45</span>
            </div>

            {/* Car Image */}
            <div className="mb-6">
              <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
                <CustomIcon name="car-image" width={339} height={149} className="w-full h-auto max-w-[339px] mx-auto" />
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full cursor-pointer hover:scale-125 transition-transform duration-200"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full cursor-pointer hover:scale-125 hover:bg-blue-300 transition-all duration-200"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full cursor-pointer hover:scale-125 hover:bg-blue-300 transition-all duration-200"></div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 -mt-4 relative z-20 pb-8">
          {/* Current Task Card */}
          <CurrentTaskCard
            taskType="charging"
            status="Charging"
            duration="2hr"
            progress={65}
          />

          {/* Vehicle Status and Smart Coach Button */}
          <div className="flex items-start gap-3 mb-4">
            <VehicleStatus
              status="unlocked"
              message="Vehicle unlocked"
              highlighted={vehicleUnlocked}
            />
            <div className="flex-1">
              <SmartCoachButton onClick={() => setCurrentPage("smart-coach")} />
            </div>
          </div>

          {/* Battery Status */}
          <BatteryStatus range="504 km" percentage={74} />

          {/* Remote Controls */}
          <RemoteControls
            controls={controls}
            onControlClick={handleControlClick}
          />
        </div>
      </div>
    </div>
  )
}
