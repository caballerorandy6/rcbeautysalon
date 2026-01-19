import { Tote } from "@phosphor-icons/react/dist/ssr"

interface ToteIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ToteIcon({ size = 20, weight = "regular", className = "" }: ToteIconProps) {
  return <Tote size={size} weight={weight} className={className} />
}
