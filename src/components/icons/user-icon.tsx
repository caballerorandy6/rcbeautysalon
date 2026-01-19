import { User } from "@phosphor-icons/react/dist/ssr"

interface UserIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function UserIcon({ size = 20, weight = "regular", className = "" }: UserIconProps) {
  return <User size={size} weight={weight} className={className} />
}
