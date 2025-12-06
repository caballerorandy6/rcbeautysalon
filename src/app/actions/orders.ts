"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"
import { auth } from "@/lib/auth/auth"

// Admin: Get all orders with customer and items
export async function getAdminOrders(search?: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const orders = await prisma.order.findMany({
    where: search
      ? {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { customer: { name: { contains: search, mode: "insensitive" } } },
            { customer: { email: { contains: search, mode: "insensitive" } } },
            { guestName: { contains: search, mode: "insensitive" } },
            { guestEmail: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      customer: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return orders.map((order) => ({
    ...order,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    total: order.total.toNumber(),
  }))
}

// Admin: Get order statistics
export async function getOrderStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalOrders, pending, completedToday, revenueThisMonth] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ["PENDING", "PAID"] } },
      }),
      prisma.order.count({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: startOfDay },
        },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: ["PAID", "COMPLETED"] },
          createdAt: { gte: startOfMonth },
        },
        _sum: {
          total: true,
        },
      }),
    ])

  return {
    totalOrders,
    pending,
    completedToday,
    revenueThisMonth: revenueThisMonth._sum.total?.toNumber() || 0,
  }
}

// Admin: Get order by ID with full details
export async function getOrderById(id: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) return null

  return {
    ...order,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    total: order.total.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
    })),
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/dashboard/orders")

    return { success: true, order }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Failed to update order status." }
  }
}

// Customer: Get order by ID (only their own orders)
export async function getOrderByIdForCustomer(id: string) {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      customer: { userId: session.user.id },
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) return null

  return {
    ...order,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    total: order.total.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
    })),
  }
}

// Customer: Get all orders for the current user
export async function getCustomerOrders() {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to view orders",
    }
  }

  const orders = await prisma.order.findMany({
    where: { customer: { userId: session.user.id } },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const convertedOrders = orders.map((order) => ({
    ...order,
    subtotal: order.subtotal.toNumber(),
    tax: order.tax.toNumber(),
    total: order.total.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
    })),
  }))

  return {
    success: true,
    orders: convertedOrders,
  }
}
