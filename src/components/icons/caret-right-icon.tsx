"use client"

import { CaretRight } from "@phosphor-icons/react"

interface CaretRightIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CaretRightIcon({ size = 20, weight = "regular", className = "" }: CaretRightIconProps) {
  return <CaretRight size={size} weight={weight} className={className} />
}
