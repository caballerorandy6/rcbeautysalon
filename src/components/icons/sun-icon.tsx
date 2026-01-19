import { Sun } from "@phosphor-icons/react/dist/ssr"

interface SunIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SunIcon({ size = 20, weight = "regular", className = "" }: SunIconProps) {
  return <Sun size={size} weight={weight} className={className} />
}
