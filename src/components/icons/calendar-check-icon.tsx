"use client"

import { CalendarCheck } from "@phosphor-icons/react"

interface CalendarCheckIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CalendarCheckIcon({ size = 20, weight = "regular", className = "" }: CalendarCheckIconProps) {
  return <CalendarCheck size={size} weight={weight} className={className} />
}
