import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

interface ArrowRightIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ArrowRightIcon({ size = 20, weight = "regular", className = "" }: ArrowRightIconProps) {
  return <ArrowRight size={size} weight={weight} className={className} />
}
