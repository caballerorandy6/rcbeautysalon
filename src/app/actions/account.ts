"use server"

import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email/password-reset"
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/lib/validations/profile"

// Update user profile image
export async function updateProfileImage(imageUrl: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    })

    revalidatePath("/my-account")
    return { success: true }
  } catch (error) {
    console.error("Update profile image error:", error)
    return { success: false, error: "Failed to update profile image" }
  }
}

// Update user profile action
export async function getUserProfile() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          phone: true,
          notes: true,
        },
      },
    },
  })
  return user
}

// Get order stats for customer
export async function getOrderStats() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { customer: true },
  })

  if (!user?.customer) {
    return {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalSpent: 0,
    }
  }

  const [totalOrders, completedOrders, pendingOrders, totalSpentResult] =
    await Promise.all([
      prisma.order.count({
        where: { customerId: user.customer.id },
      }),
      prisma.order.count({
        where: {
          customerId: user.customer.id,
          status: "COMPLETED",
        },
      }),
      prisma.order.count({
        where: {
          customerId: user.customer.id,
          status: { in: ["PENDING", "PAID"] },
        },
      }),
      prisma.order.aggregate({
        where: {
          customerId: user.customer.id,
          status: { in: ["PAID", "COMPLETED"] },
        },
        _sum: {
          total: true,
        },
      }),
    ])

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    totalSpent: totalSpentResult._sum.total?.toNumber() || 0,
  }
}

//Get current stats
export async function getUserStats() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { customer: true },
  })

  if (!user?.customer) {
    return {
      totalAppointments: 0,
      completedAppointments: 0,
      upcomingAppointments: 0,
    }
  }

  const [totalAppointments, completedAppointments, upcomingAppointments] =
    await Promise.all([
      prisma.appointment.count({
        where: { customerId: user.customer.id },
      }),
      prisma.appointment.count({
        where: {
          customerId: user.customer.id,
          status: "COMPLETED",
        },
      }),
      prisma.appointment.count({
        where: {
          customerId: user.customer.id,
          startTime: { gte: new Date() },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),
    ])

  return {
    totalAppointments,
    completedAppointments,
    upcomingAppointments,
  }
}

// Update profile action
export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, errors: [{ message: "Unauthorized" }] }
  }

  const validated = updateProfileSchema.safeParse(data)

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.data.name },
    })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { customer: true },
    })

    if (user?.customer) {
      await prisma.customer.update({
        where: { id: user.customer.id },
        data: {
          name: validated.data.name,
          phone: validated.data.phone || null,
        },
      })
    }
    revalidatePath("/my-account")
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// Change password
export async function changePassword(data: ChangePasswordInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" }
  }

  const validated = changePasswordSchema.safeParse(data)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return {
        success: false,
        error: "Cannot change password for OAuth accounts",
      }
    }

    // Verify current password
    const isValid = await bcrypt.compare(
      validated.data.currentPassword,
      user.password
    )

    if (!isValid) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(validated.data.newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: "Failed to change password" }
  }
}

// Send password reset email from account page
export async function sendPasswordResetFromAccount() {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, password: true },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.password) {
      return {
        success: false,
        error: "Cannot reset password for OAuth accounts",
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send email
    await sendPasswordResetEmail(user.email, resetToken)

    return { success: true }
  } catch (error) {
    console.error("Send password reset error:", error)
    return { success: false, error: "Failed to send reset email" }
  }
}
