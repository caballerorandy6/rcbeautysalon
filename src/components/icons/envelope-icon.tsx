"use client"

import { Envelope } from "@phosphor-icons/react"

interface EnvelopeIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function EnvelopeIcon({ size = 20, weight = "regular", className = "" }: EnvelopeIconProps) {
  return <Envelope size={size} weight={weight} className={className} />
}
