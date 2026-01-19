import { Bell } from "@phosphor-icons/react/dist/ssr"

interface BellIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function BellIcon({ size = 20, weight = "regular", className = "" }: BellIconProps) {
  return <Bell size={size} weight={weight} className={className} />
}
