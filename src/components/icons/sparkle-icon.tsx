import { Sparkle } from "@phosphor-icons/react/dist/ssr"

interface SparkleIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SparkleIcon({ size = 20, weight = "regular", className = "" }: SparkleIconProps) {
  return <Sparkle size={size} weight={weight} className={className} />
}
