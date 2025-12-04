"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { ShoppingCart } from "@phosphor-icons/react"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    image: string | null
    price: number
  }
  inStock?: boolean
}
export function AddToCartButton({ product, inStock = true }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
 

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    })
  }
  return (
    <Button onClick={handleAddToCart} variant={inStock ? "default" : "secondary"}  disabled={!inStock} className="w-full">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {inStock ? "Add to Cart" : "Out of Stock"}
    </Button>
  )
}
