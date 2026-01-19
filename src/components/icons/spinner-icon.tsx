import { CircleNotch } from "@phosphor-icons/react/dist/ssr"

interface SpinnerIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SpinnerIcon({
  size = 20,
  weight = "bold",
  className = "",
}: SpinnerIconProps) {
  return <CircleNotch size={size} weight={weight} className={className} />
}
