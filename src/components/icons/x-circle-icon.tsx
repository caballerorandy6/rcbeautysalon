"use client"

import { XCircle } from "@phosphor-icons/react"

interface XCircleIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function XCircleIcon({
  size = 20,
  weight = "regular",
  className = "",
}: XCircleIconProps) {
  return <XCircle size={size} weight={weight} className={className} />
}
