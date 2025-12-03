"use server"

import { prisma } from "@/lib/prisma"

// Admin: Get all users with customer data
export async function getAdminUsers(search?: string) {
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      customer: {
        include: {
          _count: {
            select: {
              appointments: true,
              orders: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return users
}

// Admin: Get user statistics
export async function getUserStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalUsers, activeThisMonth, newThisMonth, totalCustomers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          sessions: {
            some: {
              expires: { gte: now },
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.customer.count(),
    ])

  return { totalUsers, activeThisMonth, newThisMonth, totalCustomers }
}

// Admin: Get user by ID with full details
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          appointments: {
            include: {
              services: {
                include: {
                  service: true,
                },
              },
              staff: true,
            },
            orderBy: { startTime: "desc" },
            take: 10,
          },
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      },
      staff: true,
    },
  })
}

// Calculate total spent by customer
export async function getCustomerTotalSpent(customerId: string) {
  const [appointmentTotal, orderTotal] = await Promise.all([
    prisma.appointment.aggregate({
      where: {
        customerId,
        status: "COMPLETED",
        // Count all completed appointments (service was rendered)
      },
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.order.aggregate({
      where: {
        customerId,
        status: { in: ["PAID", "COMPLETED"] },
      },
      _sum: {
        total: true,
      },
    }),
  ])

  const appointmentSum = appointmentTotal._sum.totalPrice?.toNumber() || 0
  const orderSum = orderTotal._sum.total?.toNumber() || 0

  return appointmentSum + orderSum
}
