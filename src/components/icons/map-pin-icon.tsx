"use client"

import { MapPin } from "@phosphor-icons/react"

interface MapPinIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function MapPinIcon({ size = 20, weight = "regular", className = "" }: MapPinIconProps) {
  return <MapPin size={size} weight={weight} className={className} />
}
