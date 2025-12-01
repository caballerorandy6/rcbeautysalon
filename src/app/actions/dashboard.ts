"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"
import { endOfWeek } from "date-fns"
import { startOfWeek } from "date-fns"
import { subMonths } from "date-fns"
import { endOfMonth } from "date-fns"
import { startOfMonth } from "date-fns"

// Get dashboard statistics
export async function getDashboardStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  const [
    totalCustomers,
    weeklyCustomers,
    totalAppointments,
    monthlyAppointments,
    totalOrders,
    currentMonthOrders,
    lastMonthOrders,
    currentMonthRevenue,
    lastMonthRevenue,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({
      where: { createdAt: { gte: weekStart, lte: weekEnd } },
    }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
    }),
    prisma.order.count({ where: { status: { in: ["PAID", "COMPLETED"] } } }),
    prisma.order.count({
      where: {
        status: { in: ["PAID", "COMPLETED"] },
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),
    prisma.order.count({
      where: {
        status: { in: ["PAID", "COMPLETED"] },
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    }),
    prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { total: true },
    }),
  ])

  const currentRevenue = Number(currentMonthRevenue._sum.total || 0)
  const lastRevenue = Number(lastMonthRevenue._sum.total || 0)
  const revenueChange =
    lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0
  const ordersChange =
    lastMonthOrders > 0
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0

  return {
    revenue: { total: currentRevenue, change: revenueChange },
    appointments: { total: totalAppointments, monthly: monthlyAppointments },
    customers: { total: totalCustomers, weekly: weeklyCustomers },
    orders: { total: totalOrders, change: ordersChange },
  }
}

//Get Today's Appointments
export async function getTodaysAppointments() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const appointments = await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: startOfToday,
        lte: endOfToday,
      },
      status: { not: "CANCELLED" },
    },
    include: {
      staff: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true, phone: true } },
      services: {
        include: {
          service: { select: { id: true, name: true, duration: true } },
        },
      },
    },
    orderBy: { startTime: "asc" },
  })
  return appointments.map((appointment) => ({
    ...appointment,
  }))
}

//Get Recent Activity
export async function getRecentActivities() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const [recentAppointments, recentOrders, recentCustomers] = await Promise.all(
    [
      prisma.appointment.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          customer: { select: { id: true, name: true } },
          guestName: true,
        },
      }),
      prisma.order.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        where: { status: { in: ["PAID", "COMPLETED"] } },
        select: {
          id: true,
          createdAt: true,
          customer: { select: { id: true, name: true } },
          guestName: true,
        },
      }),
      prisma.customer.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
      }),
    ]
  )
  const activities = [
    ...recentAppointments.map((apt) => ({
      id: apt.id,
      type: "appointment" as const,
      message: `New booking: ${apt.customer?.name || apt.guestName || "Guest"}`,
      createdAt: apt.createdAt,
      color: "green" as const,
    })),
    ...recentOrders.map((order) => ({
      id: order.id,
      type: "order" as const,
      message: `Order completed: ${order.customer?.name || order.guestName || "Guest"}`,
      createdAt: order.createdAt,
      color: "blue" as const,
    })),
    ...recentCustomers.map((customer) => ({
      id: customer.id,
      type: "customer" as const,
      message: `New customer: ${customer.name}`,
      createdAt: customer.createdAt,
      color: "amber" as const,
    })),
  ]

  return activities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
}
