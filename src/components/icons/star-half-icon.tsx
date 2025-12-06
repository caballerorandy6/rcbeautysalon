"use client"

import { StarHalf } from "@phosphor-icons/react"

interface StarHalfIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function StarHalfIcon({ size = 20, weight = "regular", className = "" }: StarHalfIconProps) {
  return <StarHalf size={size} weight={weight} className={className} />
}
