"use client"

import { Desktop } from "@phosphor-icons/react"

interface DesktopIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function DesktopIcon({ size = 20, weight = "regular", className = "" }: DesktopIconProps) {
  return <Desktop size={size} weight={weight} className={className} />
}
