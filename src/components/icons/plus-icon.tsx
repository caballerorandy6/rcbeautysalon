"use client"

import { Plus } from "@phosphor-icons/react"

interface PlusIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function PlusIcon({
  size = 20,
  weight = "regular",
  className = "",
}: PlusIconProps) {
  return <Plus size={size} weight={weight} className={className} />
}
