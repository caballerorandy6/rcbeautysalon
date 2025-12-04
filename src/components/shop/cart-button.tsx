"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "@phosphor-icons/react"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

interface CartButtonProps {
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  mobile?: boolean
}

export function CartButton({
  size = "lg",
  className = "",
  mobile = false,
}: CartButtonProps) {
  const itemCount = useCartStore((state) => state.getTotalItems())
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/cart")}
      size={size}
      className={`${mobile ? "rounded-full shadow-lg" : ""} ${className}`}
    >
      <ShoppingCart size={20} weight="regular" className="mr-2" />
      Cart {itemCount > 0 && `(${itemCount})`}
    </Button>
  )
}
