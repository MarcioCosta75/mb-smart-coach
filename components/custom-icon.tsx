import Image from "next/image"
import { getImageProps } from "@/lib/dev-utils"

interface CustomIconProps {
  name:
    | "shop-bag"
    | "door"
    | "car-icon"
    | "car-image"
    | "fan"
    | "control"
    | "lock"
    | "mercedes-star"
    | "battery"
    | "info"
    | "parking-icon"
    | "house"
    | "nav"
    | "white-lock"
    | "messages"
    | "sun"
  className?: string
  width?: number
  height?: number
}

export function CustomIcon({ name, className = "", width = 24, height = 24 }: CustomIconProps) {
  const imageProps = getImageProps(name)
  
  return (
    <Image 
      src={`/icons/${name}.svg`} 
      alt={name} 
      width={width} 
      height={height} 
      className={className}
      {...imageProps}
    />
  )
}
