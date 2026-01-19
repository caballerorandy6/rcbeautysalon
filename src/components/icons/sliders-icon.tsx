import { Sliders } from "@phosphor-icons/react/dist/ssr"

interface SlidersIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SlidersIcon({ size = 20, weight = "regular", className = "" }: SlidersIconProps) {
  return <Sliders size={size} weight={weight} className={className} />
}
