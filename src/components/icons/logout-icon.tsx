import { SignOut } from "@phosphor-icons/react/dist/ssr"

interface LogoutIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function LogoutIcon({ size = 20, weight = "regular", className = "" }: LogoutIconProps) {
  return <SignOut size={size} weight={weight} className={className} />
}
