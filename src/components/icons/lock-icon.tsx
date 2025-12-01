"use client"

import { Lock } from "@phosphor-icons/react"

interface LockIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function LockIcon({
  size = 20,
  weight = "regular",
  className = "",
}: LockIconProps) {
  return <Lock size={size} weight={weight} className={className} />
}
