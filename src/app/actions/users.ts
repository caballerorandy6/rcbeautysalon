"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type UserRole = "ADMIN" | "STAFF" | "CLIENTE"

export interface AdminUpdateUserInput {
  role?: UserRole
  notes?: string
}

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

// Admin: Update user role
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    // If changing to STAFF, create staff profile if doesn't exist
    if (role === "STAFF") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { staff: true },
      })

      if (!user) {
        return { success: false, error: "User not found" }
      }

      // Create staff profile if doesn't exist
      if (!user.staff) {
        await prisma.staff.create({
          data: {
            name: user.name || "Staff Member",
            email: user.email,
            isActive: true,
            user: { connect: { id: userId } },
          },
        })
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath(`/dashboard/users/${userId}`)
    revalidatePath("/dashboard/users")

    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, error: "Failed to update user role" }
  }
}

// Admin: Update customer notes
export async function updateCustomerNotes(userId: string, notes: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.customer) {
      return { success: false, error: "User has no customer profile" }
    }

    await prisma.customer.update({
      where: { id: user.customer.id },
      data: { notes },
    })

    revalidatePath(`/dashboard/users/${userId}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating customer notes:", error)
    return { success: false, error: "Failed to update notes" }
  }
}

// Admin: Delete user
export async function deleteUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        staff: {
          include: {
            _count: {
              select: {
                appointments: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Check if user has appointments or orders
    const hasCustomerData =
      user.customer &&
      (user.customer._count.appointments > 0 || user.customer._count.orders > 0)

    const hasStaffData =
      user.staff && user.staff._count.appointments > 0

    if (hasCustomerData || hasStaffData) {
      return {
        success: false,
        error:
          "Cannot delete user with existing appointments or orders. Consider deactivating instead.",
      }
    }

    // Delete related records first
    if (user.customer) {
      await prisma.customer.delete({ where: { id: user.customer.id } })
    }
    if (user.staff) {
      await prisma.staff.delete({ where: { id: user.staff.id } })
    }

    // Delete user
    await prisma.user.delete({ where: { id: userId } })

    revalidatePath("/dashboard/users")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
