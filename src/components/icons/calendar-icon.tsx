"use client"

import { CalendarBlank } from "@phosphor-icons/react"

interface CalendarIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CalendarIcon({ size = 20, weight = "regular", className = "" }: CalendarIconProps) {
  return <CalendarBlank size={size} weight={weight} className={className} />
}
