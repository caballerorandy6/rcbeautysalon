"use client"

import { Package } from "@phosphor-icons/react"

interface PackageIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function PackageIcon({ size = 20, weight = "regular", className = "" }: PackageIconProps) {
  return <Package size={size} weight={weight} className={className} />
}
