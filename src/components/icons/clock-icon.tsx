import { Clock } from "@phosphor-icons/react/dist/ssr"

interface ClockIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ClockIcon({ size = 20, weight = "regular", className = "" }: ClockIconProps) {
  return <Clock size={size} weight={weight} className={className} />
}
