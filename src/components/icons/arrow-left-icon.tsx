"use client"

import { ArrowLeft } from "@phosphor-icons/react"

interface ArrowLeftIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ArrowLeftIcon({ size = 20, weight = "regular", className = "" }: ArrowLeftIconProps) {
  return <ArrowLeft size={size} weight={weight} className={className} />
}
