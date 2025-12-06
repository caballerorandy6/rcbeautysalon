"use client"

import { House } from "@phosphor-icons/react"

interface HouseIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function HouseIcon({ size = 20, weight = "regular", className = "" }: HouseIconProps) {
  return <House size={size} weight={weight} className={className} />
}
