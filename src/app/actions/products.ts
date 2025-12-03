"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { CreateProductInput } from "@/lib/interfaces"

export type UpdateProductInput = Partial<CreateProductInput>

// Get featured products for homepage
export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 4,
    orderBy: { name: "asc" },
  })

  return products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice?.toNumber() ?? null,
  }))
}

// Get all products for shop page
export async function getShopProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  })

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
  }))
}

// Admin: Get all products with counts
export async function getAdminProducts(search?: string) {
  const products = await prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      category: { select: { name: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
  }))
}

// Admin: Get product statistics
export async function getProductStats() {
  const [totalProducts, inStock, lowStock, outOfStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stockQuantity: { gt: 10 } } }),
    prisma.product.count({
      where: { stockQuantity: { gt: 0, lte: 10 } },
    }),
    prisma.product.count({ where: { stockQuantity: { equals: 0 } } }),
  ])

  return { totalProducts, inStock, lowStock, outOfStock }
}

// Admin: Get product by ID
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!product) return null

  return {
    ...product,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
  }
}

// Create product
export async function createProduct(data: CreateProductInput) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
      },
    })

    revalidatePath("/dashboard/products")
    revalidatePath("/shop")

    return { success: true, product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Failed to create product." }
  }
}

// Update product
export async function updateProduct(id: string, data: UpdateProductInput) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    })

    revalidatePath("/dashboard/products")
    revalidatePath("/shop")

    return { success: true, product }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Failed to update product." }
  }
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const orderCount = await prisma.orderItem.count({
      where: { productId: id },
    })

    if (orderCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete product with existing orders. Deactivate instead.",
      }
    }

    await prisma.product.delete({ where: { id } })

    revalidatePath("/dashboard/products")
    revalidatePath("/shop")

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product." }
  }
}

// Toggle product active status
export async function toggleProductStatus(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!product) {
      return { success: false, error: "Product not found." }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    })

    revalidatePath("/dashboard/products")
    revalidatePath("/shop")

    return { success: true, isActive: updated.isActive }
  } catch (error) {
    console.error("Error toggling product status:", error)
    return { success: false, error: "Failed to toggle product status." }
  }
}
