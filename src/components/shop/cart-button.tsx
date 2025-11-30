"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "@phosphor-icons/react"

interface CartButtonProps {
  itemCount?: number
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  mobile?: boolean
}

export function CartButton({
  itemCount = 0,
  size = "lg",
  className = "",
  mobile = false
}: CartButtonProps) {
  return (
    <Button
      size={size}
      className={`${mobile ? "rounded-full shadow-lg" : ""} ${className}`}
    >
      <ShoppingCart size={20} weight="regular" className="mr-2" />
      Cart ({itemCount})
    </Button>
  )
}
