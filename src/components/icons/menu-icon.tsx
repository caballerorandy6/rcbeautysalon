import { List } from "@phosphor-icons/react/dist/ssr"

interface MenuIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function MenuIcon({ size = 20, weight = "regular", className = "" }: MenuIconProps) {
  return <List size={size} weight={weight} className={className} />
}
