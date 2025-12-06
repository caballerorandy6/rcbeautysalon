"use client"

import { X } from "@phosphor-icons/react"

interface CloseIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CloseIcon({ size = 20, weight = "regular", className = "" }: CloseIconProps) {
  return <X size={size} weight={weight} className={className} />
}
