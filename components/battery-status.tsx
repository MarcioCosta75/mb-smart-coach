import { Card } from "@/components/ui/card"
import { CustomIcon } from "./custom-icon"

interface BatteryStatusProps {
  range: string
  percentage: number
}

export function BatteryStatus({ range, percentage }: BatteryStatusProps) {
  return (
    <Card className="p-4 mb-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <CustomIcon 
            name="battery" 
            width={14} 
            height={24} 
            className="w-3.5 h-6"
          />
          <span className="text-xl font-semibold text-gray-900">{range}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl font-semibold text-gray-900">{percentage}%</span>
          <div className="w-2 h-4 bg-yellow-400 rounded-sm ml-1" />
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  )
} 