import { TrendUp } from "@phosphor-icons/react/dist/ssr"

interface TrendingUpIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function TrendingUpIcon({ size = 20, weight = "regular", className = "" }: TrendingUpIconProps) {
  return <TrendUp size={size} weight={weight} className={className} />
}
