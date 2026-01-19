import { Funnel } from "@phosphor-icons/react/dist/ssr"

interface FilterIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function FilterIcon({
  size = 20,
  weight = "regular",
  className = "",
}: FilterIconProps) {
  return <Funnel size={size} weight={weight} className={className} />
}
