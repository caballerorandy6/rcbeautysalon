import { Star } from "@phosphor-icons/react/dist/ssr"

interface StarIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function StarIcon({ size = 20, weight = "regular", className = "" }: StarIconProps) {
  return <Star size={size} weight={weight} className={className} />
}
