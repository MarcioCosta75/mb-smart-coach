"use client"

import { useState } from "react"
import { Menu, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SmartCoachPage } from "./smart-coach-page"
import { CustomIcon } from "./components/custom-icon"

export default function Component() {
  const [activeControl, setActiveControl] = useState(0)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const controls = [
    { icon: "lock", label: "Unlocked", active: true },
    { icon: "door", label: "Closed", active: false },
    { icon: "control", label: "Closed", active: false },
    { icon: "fan", label: "Off", active: false },
  ]

  if (currentPage === "smart-coach") {
    return <SmartCoachPage onBack={() => setCurrentPage("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <Menu className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" />
        <h1 className="text-base sm:text-lg font-medium">Mercedes-Benz</h1>
        <div
          className="relative cursor-pointer hover:opacity-80 transition-opacity"
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

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-8">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Updated on 07/10/2025 - 07:45</span>
            </div>

            {/* Car Image */}
            <div className="mb-6">
              <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
                <CustomIcon name="car-icon" width={280} height={168} className="w-full h-auto max-w-[280px] mx-auto" />
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Smart Coach Section with Vehicle Status */}
        <div className="px-4 sm:px-6 -mt-4 relative z-20">
          <div className="space-y-3">
            {/* Vehicle Status Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Vehicle unlocked</span>
            </div>

            {/* Smart Coach Button */}
            <Card
              className="bg-black text-white p-4 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors w-full"
              onClick={() => setCurrentPage("smart-coach")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8">
                  <CustomIcon name="mercedes-star" width={32} height={28} className="w-8 h-7" />
                </div>
                <span className="text-lg font-medium">SMART COACH</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Battery/Range Info */}
        <div className="px-4 sm:px-6 mt-4">
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CustomIcon name="battery" width={14} height={24} className="w-3.5 h-6" />
                <span className="text-lg font-semibold">504 km</span>
              </div>
              <span className="text-lg font-semibold">74%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "74%" }}></div>
            </div>
          </Card>

          {/* Remote Controls */}
          <Card className="p-4 mb-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase">Remote Controls</h3>
              <Button variant="link" className="text-blue-500 p-0 h-auto">
                Customise
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {controls.map((control, index) => (
                <button
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg text-center transition-colors ${
                    control.active ? "bg-blue-50" : "bg-gray-100"
                  }`}
                  onClick={() => setActiveControl(index)}
                >
                  <div className="flex justify-center mb-2">
                    <CustomIcon
                      name={control.icon as any}
                      width={
                        control.icon === "lock"
                          ? 21
                          : control.icon === "door"
                            ? 28
                            : control.icon === "control"
                              ? 22
                              : 29
                      }
                      height={
                        control.icon === "lock"
                          ? 30
                          : control.icon === "door"
                            ? 18
                            : control.icon === "control"
                              ? 27
                              : 28
                      }
                      className={`${
                        control.icon === "lock"
                          ? "w-5 h-7"
                          : control.icon === "door"
                            ? "w-7 h-4"
                            : control.icon === "control"
                              ? "w-5 h-6"
                              : "w-7 h-7"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{control.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="flex items-center justify-around py-3 px-4">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <CustomIcon name="house" width={25} height={29} className="w-6 h-7" />
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <CustomIcon name="car-icon" width={40} height={24} className="w-10 h-6" />
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <CustomIcon name="nav" width={29} height={28} className="w-7 h-7" />
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
              <CustomIcon name="shop-bag" width={22} height={22} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
