"use client"

import type React from "react"
import { TaskCarousel } from "@/components/task-carousel"
import { VehicleStatus } from "@/components/vehicle-status"
import { SmartCoachButton } from "@/components/smart-coach-button"
import { BatteryStatus } from "@/components/battery-status"
import { RemoteControls } from "@/components/remote-controls"

interface Control {
  icon: string
  label: string
  active: boolean
}

interface Task {
  id: string
  type: "charging" | "notification" | "parking"
  status: string
  duration?: string
  progress?: number
  message?: string
}

interface MainContentProps {
  tasks: Task[]
  controls: Control[]
  vehicleUnlocked: boolean
  batteryPercentage?: number
  batteryRange?: string
  onSmartCoachClick: () => void
  onControlClick: (index: number) => void
}

export function MainContent({
  tasks,
  controls,
  vehicleUnlocked,
  batteryPercentage = 74,
  batteryRange = "504 km",
  onSmartCoachClick,
  onControlClick
}: MainContentProps) {
  return (
    <div className="px-4 sm:px-6 -mt-4 relative z-20 pb-8">
      {/* Task Carousel */}
      <TaskCarousel tasks={tasks} />

      {/* Vehicle Status and Smart Coach Button */}
      <div className="flex items-start gap-3 mb-4">
        <VehicleStatus
          status="unlocked"
          message="Vehicle unlocked"
          highlighted={vehicleUnlocked}
        />
        <div className="flex-1">
          <SmartCoachButton onClick={onSmartCoachClick} />
        </div>
      </div>

      {/* Battery Status */}
      <BatteryStatus range={batteryRange} percentage={batteryPercentage} />

      {/* Remote Controls */}
      <RemoteControls
        controls={controls}
        onControlClick={onControlClick}
      />
    </div>
  )
}

export type { Control, Task } 