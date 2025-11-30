"use client"

import { WarningCircle } from "@phosphor-icons/react"

interface WarningCircleIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function WarningCircleIcon({ size = 20, weight = "regular", className = "" }: WarningCircleIconProps) {
  return <WarningCircle size={size} weight={weight} className={className} />
}
