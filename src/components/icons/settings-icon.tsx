import { Gear } from "@phosphor-icons/react/dist/ssr"

interface SettingsIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SettingsIcon({ size = 20, weight = "regular", className = "" }: SettingsIconProps) {
  return <Gear size={size} weight={weight} className={className} />
}
