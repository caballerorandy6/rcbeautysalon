"use client"

import { Image } from "@phosphor-icons/react"

interface ImageIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ImageIcon({
  size = 20,
  weight = "regular",
  className = "",
}: ImageIconProps) {
  return <Image size={size} weight={weight} className={className} />
}
