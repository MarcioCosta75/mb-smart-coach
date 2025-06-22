import { Card } from "@/components/ui/card"
import { CustomIcon } from "./custom-icon"

interface BatteryStatusProps {
  range: string
  percentage: number
}

export function BatteryStatus({ range, percentage }: BatteryStatusProps) {
  return (
    <Card className="p-4 mb-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl shadow-md relative">
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
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Yellow triangles */}
        <div className="absolute top-0 h-3 flex items-center" style={{ left: `${percentage}%` }}>
          {/* Triangle pointing down */}
          <div 
            className="absolute -top-2 left-0 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #fbbf24'
            }}
          />
          {/* Triangle pointing up */}
          <div 
            className="absolute -bottom-2 left-0 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '8px solid #fbbf24'
            }}
          />
        </div>
      </div>
    </Card>
  )
} 