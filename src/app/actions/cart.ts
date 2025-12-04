"use server"

import { prisma } from "@/lib/prisma"
import { CartItem } from "@/store/cart-store";

export async function validateCartStock(items: CartItem[]) {
  const errors = []

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })

    if (!product || product.stockQuantity < item.quantity) {
      errors.push({
        productId: item.productId,
        name: item.name,
        available: product?.stockQuantity ?? 0,
        requested: item.quantity,
      })
    }
  }

  return { valid: errors.length === 0, errors }
}
