"use client"

import { UserGear } from "@phosphor-icons/react"

interface UserCogIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function UserCogIcon({ size = 20, weight = "regular", className = "" }: UserCogIconProps) {
  return <UserGear size={size} weight={weight} className={className} />
}
