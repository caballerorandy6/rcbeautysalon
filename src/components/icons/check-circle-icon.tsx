import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

interface CheckCircleIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CheckCircleIcon({
  size = 20,
  weight = "regular",
  className = "",
}: CheckCircleIconProps) {
  return <CheckCircle size={size} weight={weight} className={className} />
}
