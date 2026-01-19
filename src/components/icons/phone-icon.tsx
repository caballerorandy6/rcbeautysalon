import { Phone } from "@phosphor-icons/react/dist/ssr"

interface PhoneIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function PhoneIcon({ size = 20, weight = "regular", className = "" }: PhoneIconProps) {
  return <Phone size={size} weight={weight} className={className} />
}
