import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

interface CaretLeftIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CaretLeftIcon({ size = 20, weight = "regular", className = "" }: CaretLeftIconProps) {
  return <CaretLeft size={size} weight={weight} className={className} />
}
