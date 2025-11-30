"use client"

import { Scissors } from "@phosphor-icons/react"

interface ScissorsIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ScissorsIcon({ size = 20, weight = "regular", className = "" }: ScissorsIconProps) {
  return <Scissors size={size} weight={weight} className={className} />
}
