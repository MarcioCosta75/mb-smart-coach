"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"

export interface ScheduleItem {
  id: string
  time: string
  task: string
  duration: string
  icon: "charging" | "battery"
}

export interface NotificationItem {
  id: string
  message: string
  timeAgo: string
  icon: "sun" | "nav"
}

interface SmartCoachDrawerProps {
  isExpanded: boolean
  onToggle: () => void
  scheduleItems: ScheduleItem[]
  notificationItems: NotificationItem[]
}

export function SmartCoachDrawer({ 
  isExpanded, 
  onToggle, 
  scheduleItems, 
  notificationItems 
}: SmartCoachDrawerProps) {
  
  const getScheduleIcon = (icon: string) => {
    if (icon === "charging") {
      return (
        <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1V4H9.5V1H5Z" fill="black"/>
          <path d="M7 18L9 13H7V18Z" fill="black"/>
          <path d="M7 7.5L4.5 13H7V7.5Z" fill="black"/>
          <path d="M5 4H1V23H13.5V4H9.5M5 4V1H9.5V4M5 4H9.5M7 13H4.5L7 7.5V13ZM7 13H9L7 18V13Z" stroke="black" strokeLinejoin="round"/>
        </svg>
      )
    }
    return <CustomIcon name="battery" width={14} height={24} className="w-3.5 h-6" />
  }

  return (
    <div 
      className={`bg-white rounded-b-3xl overflow-hidden flex flex-col shadow-lg transition-all duration-1000 relative z-10 ${isExpanded ? 'h-[70vh]' : 'h-auto'}`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      }}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-center py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all duration-500 hover:scale-110 active:scale-95 p-2 rounded-lg hover:bg-gray-50"
          aria-label={isExpanded ? "Collapse drawer" : "Expand drawer"}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div 
            className="transition-all duration-500"
            style={{
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Drawer Content */}
      {isExpanded && (
        <div 
          className="flex-1 relative transition-all duration-800 opacity-100 translate-y-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '200ms'
          }}
        >
          {/* Mercedes Star Pattern Background */}
          <div className="absolute inset-0 opacity-2 pointer-events-none z-[-1]">
            <div className="grid grid-cols-6 gap-8 h-full p-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <CustomIcon name="mercedes-star" width={12} height={10} className="w-3 h-2.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 p-5 space-y-6 pb-8">
            {/* Schedule Section */}
            <div>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                SCHEDULE
              </h2>
              <div className="space-y-3">
                {scheduleItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{
                      animationDelay: `${(index + 1) * 100}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          {getScheduleIcon(item.icon)}
                        </div>
                        <span className="text-base font-semibold text-gray-900">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                        <span className="text-xs text-gray-500 font-medium">Duration</span>
                        <span className="text-sm font-bold text-gray-900">{item.duration}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 ml-11 font-medium">{item.time}</div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 mt-4 font-semibold transition-colors duration-200 flex items-center gap-1">
                Expand more
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Notification Section */}
            <div>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                NOTIFICATION
              </h2>
              <div className="space-y-3">
                {notificationItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{
                      animationDelay: `${(index + 3) * 100}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5">
                        {item.icon === "sun" ? (
                          <CustomIcon name="sun" width={20} height={20} className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CustomIcon name="nav" width={20} height={20} className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed mb-2 font-medium">
                          {item.message}
                        </p>
                        <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-2 py-1 rounded-md">{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 mt-4 font-semibold transition-colors duration-200 flex items-center gap-1">
                Expand more
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 