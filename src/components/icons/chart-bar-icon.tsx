import { ChartBar } from "@phosphor-icons/react/dist/ssr"

interface ChartBarIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ChartBarIcon({ size = 20, weight = "regular", className = "" }: ChartBarIconProps) {
  return <ChartBar size={size} weight={weight} className={className} />
}
