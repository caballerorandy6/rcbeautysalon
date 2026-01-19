import { PencilSimple } from "@phosphor-icons/react/dist/ssr"

interface PencilIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function PencilIcon({
  size = 20,
  weight = "regular",
  className = "",
}: PencilIconProps) {
  return <PencilSimple size={size} weight={weight} className={className} />
}
