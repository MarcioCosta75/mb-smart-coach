import { Card } from "@/components/ui/card"

interface CurrentTaskCardProps {
  taskType: "charging" | "parking" | "driving"
  status: string
  duration?: string
  progress?: number
}

export function CurrentTaskCard({ 
  taskType, 
  status, 
  duration, 
  progress = 0 
}: CurrentTaskCardProps) {
  const getIcon = () => {
    switch (taskType) {
      case "charging":
        return (
          <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1V4H9.5V1H5Z" fill="black"/>
            <path d="M7 18L9 13H7V18Z" fill="black"/>
            <path d="M7 7.5L4.5 13H7V7.5Z" fill="black"/>
            <path d="M5 4H1V23H13.5V4H9.5M5 4V1H9.5V4M5 4H9.5M7 13H4.5L7 7.5V13ZM7 13H9L7 18V13Z" stroke="black" strokeLinejoin="round"/>
          </svg>
        )
      case "parking":
        return "🅿️"
      default:
        return "🚗"
    }
  }

  return (
    <Card className="p-4 mb-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[120px]">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-medium">
        Current Task - Schedule
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            {taskType === "charging" ? getIcon() : (
              <span className="text-lg">{getIcon()}</span>
            )}
          </div>
          <span className="text-lg font-semibold text-gray-900">{status}</span>
        </div>
        
        {duration && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Duration</span>
            <span className="text-lg font-semibold text-gray-900">{duration}</span>
          </div>
        )}
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  )
} 