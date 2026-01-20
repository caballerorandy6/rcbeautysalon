"use server"

import { prisma } from "@/lib/prisma"
import { CartItem } from "@/store/cart-store";

export async function validateCartStock(items: CartItem[]) {
  const errors: {
    productId: string
    name: string
    available: number
    requested: number
  }[] = []

  // Fetch all products in parallel (not sequentially)
  const products = await Promise.all(
    items.map((item) =>
      prisma.product.findUnique({
        where: { id: item.productId },
      })
    )
  )

  // Validate each product
  items.forEach((item, index) => {
    const product = products[index]
    if (!product || product.stockQuantity < item.quantity) {
      errors.push({
        productId: item.productId,
        name: item.name,
        available: product?.stockQuantity ?? 0,
        requested: item.quantity,
      })
    }
  })

  return { valid: errors.length === 0, errors }
}
