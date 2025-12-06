"use client"

import { WarningCircle } from "@phosphor-icons/react"

interface WarningCircleIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
  style?: React.CSSProperties
}

export function WarningCircleIcon({ size = 20, weight = "regular", className = "", style }: WarningCircleIconProps) {
  return <WarningCircle size={size} weight={weight} className={className} style={style} />
}
