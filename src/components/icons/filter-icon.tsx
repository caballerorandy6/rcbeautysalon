"use client"

import { Funnel } from "@phosphor-icons/react"

interface FilterIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function FilterIcon({
  size = 20,
  weight = "regular",
  className = "",
}: FilterIconProps) {
  return <Funnel size={size} weight={weight} className={className} />
}
