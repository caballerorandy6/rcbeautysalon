import { Moon } from "@phosphor-icons/react/dist/ssr"

interface MoonIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function MoonIcon({ size = 20, weight = "regular", className = "" }: MoonIconProps) {
  return <Moon size={size} weight={weight} className={className} />
}
