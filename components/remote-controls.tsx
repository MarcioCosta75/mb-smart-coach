import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomIcon } from "./custom-icon"

interface Control {
  icon: string
  label: string
  active: boolean
}

interface RemoteControlsProps {
  controls: Control[]
  onControlClick?: (index: number) => void
}

export function RemoteControls({ controls, onControlClick }: RemoteControlsProps) {
  const [loadingControl, setLoadingControl] = useState<number | null>(null)

  const handleControlClick = (index: number) => {
    setLoadingControl(index)
    onControlClick?.(index)
    
    // Simulate loading feedback
    setTimeout(() => {
      setLoadingControl(null)
    }, 800)
  }

  const getIconDimensions = (iconName: string) => {
    switch (iconName) {
      case "lock":
        return { width: 21, height: 30, className: "w-5 h-7" }
      case "door":
        return { width: 28, height: 18, className: "w-7 h-4" }
      case "control":
        return { width: 22, height: 27, className: "w-5 h-6" }
      case "fan":
        return { width: 29, height: 28, className: "w-7 h-7" }
      default:
        return { width: 24, height: 24, className: "w-6 h-6" }
    }
  }

  return (
    <Card className="p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          Remote Controls
        </h3>
        <Button 
          variant="link" 
          className="text-blue-500 p-0 h-auto hover:text-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Customise
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {controls.map((control, index) => {
          const iconDimensions = getIconDimensions(control.icon)
          
          return (
            <button
              key={index}
              className={`p-3 sm:p-4 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                control.active
                  ? "bg-blue-50 border border-blue-200" 
                  : "bg-gray-50 hover:bg-gray-100"
              } ${
                loadingControl === index ? "animate-pulse bg-blue-200" : ""
              }`}
              onClick={() => handleControlClick(index)}
              disabled={loadingControl !== null}
            >
              <div className="flex justify-center mb-2">
                <CustomIcon
                  name={control.icon as any}
                  width={iconDimensions.width}
                  height={iconDimensions.height}
                  className={`${iconDimensions.className} ${
                    loadingControl === index ? "animate-spin" : ""
                  } transition-transform duration-200`}
                />
              </div>
              <span className={`text-xs ${
                control.active ? "text-blue-700 font-medium" : "text-gray-600"
              }`}>
                {control.label}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
} 