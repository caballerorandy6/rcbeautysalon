"use client"

import { SquaresFour } from "@phosphor-icons/react"

interface LayoutDashboardIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function LayoutDashboardIcon({ size = 20, weight = "regular", className = "" }: LayoutDashboardIconProps) {
  return <SquaresFour size={size} weight={weight} className={className} />
}
