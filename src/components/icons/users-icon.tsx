import { Users } from "@phosphor-icons/react/dist/ssr"

interface UsersIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function UsersIcon({ size = 20, weight = "regular", className = "" }: UsersIconProps) {
  return <Users size={size} weight={weight} className={className} />
}
