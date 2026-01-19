import { SpinnerGap } from "@phosphor-icons/react/dist/ssr"

interface SpinnerGapIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SpinnerGapIcon({ size = 20, weight = "regular", className = "" }: SpinnerGapIconProps) {
  return <SpinnerGap size={size} weight={weight} className={className} />
}
