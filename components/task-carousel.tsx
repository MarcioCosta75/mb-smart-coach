"use client"

import { useState } from "react"
import { CurrentTaskCard } from "./current-task-card"
import { CustomIcon } from "./custom-icon"

interface Task {
  id: string
  type: "charging" | "parking" | "driving" | "notification"
  status: string
  duration?: string
  progress?: number
  message?: string
}

interface TaskCarouselProps {
  tasks: Task[]
}

export function TaskCarousel({ tasks }: TaskCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTask = () => {
    setCurrentIndex((prev) => (prev + 1) % tasks.length)
  }

  const prevTask = () => {
    setCurrentIndex((prev) => (prev - 1 + tasks.length) % tasks.length)
  }

  const goToTask = (index: number) => {
    setCurrentIndex(index)
  }

  if (tasks.length === 0) return null

  const currentTask = tasks[currentIndex]

  const renderTaskCard = (task: Task) => {
    if (task.type === "notification") {
      return (
        <div className="p-4 mb-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[120px]">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-medium">
            Notification
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <CustomIcon 
                  name="sun" 
                  width={33} 
                  height={32} 
                  className="w-6 h-6"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                  {task.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <CurrentTaskCard
        taskType={task.type}
        status={task.status}
        duration={task.duration}
        progress={task.progress}
      />
    )
  }

  return (
    <div className="relative">
      {/* Task Card */}
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(0%)` }}
      >
        {renderTaskCard(currentTask)}
      </div>

      {/* Navigation Dots */}
      {tasks.length > 1 && (
        <div className="flex justify-center gap-2 -mt-2 mb-4">
          {tasks.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-300 hover:bg-blue-300"
              }`}
              onClick={() => goToTask(index)}
            />
          ))}
        </div>
      )}

      {/* Swipe Touch Handlers */}
      {tasks.length > 1 && (
        <div className="absolute inset-0 flex">
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={prevTask}
            title="Previous task"
          />
          <div 
            className="w-1/2 h-full cursor-pointer" 
            onClick={nextTask}
            title="Next task"
          />
        </div>
      )}
    </div>
  )
} 