"use client"

import { Eye } from "@phosphor-icons/react"

interface EyeIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function EyeIcon({
  size = 20,
  weight = "regular",
  className = "",
}: EyeIconProps) {
  return <Eye size={size} weight={weight} className={className} />
}
