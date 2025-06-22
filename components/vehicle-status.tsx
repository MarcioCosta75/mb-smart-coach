interface VehicleStatusProps {
  status: "unlocked" | "locked" | "charging" | "driving"
  message: string
  highlighted?: boolean
}

export function VehicleStatus({ status, message, highlighted = false }: VehicleStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "unlocked":
        return "bg-blue-500"
      case "locked":
        return "bg-green-500"
      case "charging":
        return "bg-yellow-500"
      case "driving":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "unlocked":
      case "locked":
        return "🔓"
      case "charging":
        return "⚡"
      case "driving":
        return "🚗"
      default:
        return "ℹ️"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md w-24 h-16">
      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
        <span className="text-white text-xs font-bold">i</span>
      </div>
      <span className="text-xs font-medium text-black text-center leading-tight">
        Vehicle<br />unlocked
      </span>
    </div>
  )
} 