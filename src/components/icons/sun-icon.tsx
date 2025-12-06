"use client"

import { Sun } from "@phosphor-icons/react"

interface SunIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SunIcon({ size = 20, weight = "regular", className = "" }: SunIconProps) {
  return <Sun size={size} weight={weight} className={className} />
}
