"use client"

import { MagnifyingGlass } from "@phosphor-icons/react"

interface SearchIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function SearchIcon({ size = 20, weight = "regular", className = "" }: SearchIconProps) {
  return <MagnifyingGlass size={size} weight={weight} className={className} />
}
