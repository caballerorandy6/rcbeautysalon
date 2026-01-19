import { Minus } from "@phosphor-icons/react/dist/ssr"

interface MinusIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function MinusIcon({ size = 20, weight = "regular", className = "" }: MinusIconProps) {
  return <Minus size={size} weight={weight} className={className} />
}
