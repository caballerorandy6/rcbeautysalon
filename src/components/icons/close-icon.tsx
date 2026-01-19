import { X } from "@phosphor-icons/react/dist/ssr"

interface CloseIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CloseIcon({ size = 20, weight = "regular", className = "" }: CloseIconProps) {
  return <X size={size} weight={weight} className={className} />
}
