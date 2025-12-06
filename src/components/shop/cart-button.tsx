"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCartIcon } from "@/components/icons"
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
      <ShoppingCartIcon size={20} weight="regular" className="mr-2" />
      Cart {itemCount > 0 && `(${itemCount})`}
    </Button>
  )
}
