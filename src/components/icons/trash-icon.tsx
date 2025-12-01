"use client"

import { Trash } from "@phosphor-icons/react"

interface TrashIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function TrashIcon({
  size = 20,
  weight = "regular",
  className = "",
}: TrashIconProps) {
  return <Trash size={size} weight={weight} className={className} />
}
