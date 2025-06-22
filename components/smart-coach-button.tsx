import { Card } from "@/components/ui/card"
import { CustomIcon } from "./custom-icon"

interface SmartCoachButtonProps {
  onClick: () => void
}

export function SmartCoachButton({ onClick }: SmartCoachButtonProps) {
  return (
    <Card
      className="bg-black text-white p-4 rounded-xl cursor-pointer hover:bg-gray-900 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <CustomIcon 
            name="mercedes-star" 
            width={32} 
            height={28} 
            className="w-8 h-7 text-white"
          />
        </div>
        <span className="text-lg font-medium">SMART COACH</span>
      </div>
    </Card>
  )
} 