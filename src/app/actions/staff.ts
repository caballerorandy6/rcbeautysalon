"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { CreateStaffInput } from "@/lib/interfaces"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { StaffAppointmentFilters } from "@/lib/interfaces"
import { StaffSelfUpdateFormData } from "@/lib/validations/staff"

export type UpdateStaffInput = Partial<CreateStaffInput> & {
  serviceIds?: string[]
  workingHours?: {
    dayOfWeek: number
    isActive: boolean
    startTime: string
    endTime: string
  }[]
}

//Get All Active Services for Staff Form
export const getActiveServicesForStaff = async () => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  return services
}

//Get Featured Staff for Homepage
export const getFeaturedStaff = async () => {
  const staffMembers = await prisma.staff.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { name: "asc" },
  })
  return staffMembers
}

//Get Staff Member
export const getStaffMembers = async () => {
  const staffMembers = await prisma.staff.findMany({
    where: {
      isActive: true,
    },
    include: {
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true,
            },
          },
        },
      },
      workingHours: true,
    },
  })
  // Serialize Decimal values
  return staffMembers.map((staff) => ({
    ...staff,
    services: staff.services.map((ss) => ({
      ...ss,
      service: {
        ...ss.service,
        price: Number(ss.service.price),
      },
    })),
  }))
}

//Get Staff Member by Slug
// Cached to avoid duplicate fetches in generateMetadata + page component
export const getStaffMemberBySlug = cache(async (slug: string) => {
  // Get all active staff and find by slug match
  const staffMembers = await prisma.staff.findMany({
    where: {
      isActive: true,
    },
    include: {
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              duration: true,
              price: true,
            },
          },
        },
      },
      workingHours: true,
    },
  })

  // Generate slug from name and find match
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

  const staffMember = staffMembers.find(
    (staff) => generateSlug(staff.name) === slug
  )

  if (!staffMember) return null

  // Serialize Decimal values
  return {
    ...staffMember,
    services: staffMember.services.map((ss) => ({
      ...ss,
      service: {
        ...ss.service,
        price: Number(ss.service.price),
      },
    })),
  }
})

//Get Admin Staff Members
export const getAdminStaffMembers = async (search?: string) => {
  const staffMembers = await prisma.staff.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      _count: {
        select: {
          services: true,
          appointments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return staffMembers
}

//Get Admin Staff Stats
export const getAdminStaffStats = async () => {
  const [totalStaff, activeStaff, inactiveStaff] = await Promise.all([
    prisma.staff.count(),
    prisma.staff.count({ where: { isActive: true } }),
    prisma.staff.count({ where: { isActive: false } }),
  ])
  return { totalStaff, activeStaff, inactiveStaff }
}

//Get Staff Member by ID
export const getStaffMemberById = async (id: string) => {
  const staffMember = await prisma.staff.findUnique({
    where: { id },
    include: {
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      workingHours: true,
      user: true,
    },
  })
  if (!staffMember) {
    return null
  }
  return staffMember
}

//Create Staff Member
export const createStaffMember = async (data: UpdateStaffInput) => {
  try {
    const { serviceIds, workingHours, email, ...staffData } = data

    if (!staffData.name || !email) {
      return { success: false, error: "Name and email are required" }
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Check if this user is already linked to a staff member
      const existingStaff = await prisma.staff.findUnique({
        where: { userId: existingUser.id },
      })

      if (existingStaff) {
        return {
          success: false,
          error: "A staff member with this email already exists",
        }
      }
    }

    // Create user if doesn't exist, then create staff
    const staff = await prisma.staff.create({
      data: {
        name: staffData.name,
        email,
        phone: staffData.phone,
        bio: staffData.bio,
        image: staffData.image,
        isActive: staffData.isActive ?? true,
        user: existingUser
          ? { connect: { id: existingUser.id } }
          : {
              create: {
                name: staffData.name,
                email,
                role: "STAFF",
              },
            },
      },
    })

    // Update user role to STAFF if they exist
    if (existingUser && existingUser.role !== "STAFF") {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: "STAFF" },
      })
    }

    // Create service associations
    if (serviceIds?.length) {
      await prisma.staffService.createMany({
        data: serviceIds.map((serviceId) => ({
          staffId: staff.id,
          serviceId,
        })),
      })
    }

    // Create working hours
    if (workingHours?.length) {
      await prisma.workingHours.createMany({
        data: workingHours.map((wh) => ({
          staffId: staff.id,
          dayOfWeek: wh.dayOfWeek,
          isActive: wh.isActive,
          startTime: wh.startTime,
          endTime: wh.endTime,
        })),
      })
    }

    revalidatePath("/dashboard/staff")

    return { success: true, staff }
  } catch (error) {
    console.error("Error creating staff member:", error)
    return { success: false, error: "Failed to create staff member" }
  }
}

//Update Staff Member
export const updateStaffMember = async (id: string, data: UpdateStaffInput) => {
  try {
    const { serviceIds, workingHours, ...staffData } = data

    const updatedStaffMember = await prisma.staff.update({
      where: { id },
      data: staffData,
    })

    // Update service associations
    if (serviceIds !== undefined) {
      await prisma.staffService.deleteMany({
        where: { staffId: id },
      })
      if (serviceIds.length) {
        await prisma.staffService.createMany({
          data: serviceIds.map((serviceId) => ({
            staffId: id,
            serviceId,
          })),
        })
      }
    }

    // Update working hours
    if (workingHours !== undefined) {
      await prisma.workingHours.deleteMany({
        where: { staffId: id },
      })
      if (workingHours.length) {
        await prisma.workingHours.createMany({
          data: workingHours.map((wh) => ({
            staffId: id,
            dayOfWeek: wh.dayOfWeek,
            isActive: wh.isActive,
            startTime: wh.startTime,
            endTime: wh.endTime,
          })),
        })
      }
    }

    revalidatePath("/dashboard/staff")

    return { success: true, staff: updatedStaffMember }
  } catch (error) {
    console.error("Error updating staff member:", error)
    return { success: false, error: "Failed to update staff member." }
  }
}

//Delete Staff Member (deactivates and changes user role to CLIENTE)
export const deleteStaffMember = async (id: string) => {
  try {
    // Get staff with user info
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!staff) {
      return { success: false, error: "Staff member not found." }
    }

    // Deactivate staff profile (don't delete to preserve history)
    await prisma.staff.update({
      where: { id },
      data: { isActive: false },
    })

    // Change user role back to CLIENTE if user exists
    if (staff.userId) {
      await prisma.user.update({
        where: { id: staff.userId },
        data: { role: "CLIENTE" },
      })
    }

    revalidatePath("/dashboard/staff")
    revalidatePath("/dashboard/users")
    revalidatePath("/staff")

    return { success: true }
  } catch (error) {
    console.error("Error removing staff member:", error)
    return { success: false, error: "Failed to remove staff member." }
  }
}

//Toggle Staff Active Status
export const toggleStaffActiveStatus = async (id: string) => {
  try {
    const staffMember = await prisma.staff.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!staffMember) {
      return { success: false, error: "Staff member not found." }
    }

    const updatedStaffMember = await prisma.staff.update({
      where: { id },
      data: { isActive: !staffMember.isActive },
    })
    revalidatePath("/dashboard/staff")
    return { success: true, staff: updatedStaffMember }
  } catch (error) {
    console.error("Error toggling staff active status:", error)
    return { success: false, error: "Failed to toggle staff active status." }
  }
}

// Get Current Staff Member
export const getCurrentStaffMember = async () => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const staffMember = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      include: {
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                duration: true,
                price: true,
                description: true,
                category: true,
              },
            },
          },
        },
        workingHours: true,
      },
    })

    if (!staffMember) {
      return {
        success: false,
        error: "Staff profile not found",
      }
    }

    return {
      success: true,
      staff: {
        ...staffMember,
        services: staffMember?.services.map((ss) => ({
          ...ss,
          service: {
            ...ss.service,
            price: Number(ss.service.price),
          },
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching current staff member:", error)
    return {
      success: false,
      error: "Failed to fetch current staff member.",
    }
  }
}

// Get Staff Portal Stats
export const getStaffPortalStats = async () => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const now = new Date()
    const dayStart = startOfDay(now)
    const dayEnd = endOfDay(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const staffMember = await prisma.staff.findUnique({
      where: { userId: session.user.id },
    })

    if (!staffMember) {
      return {
        success: false,
        error: "Staff profile not found",
      }
    }

    const [todaysAppointments, monthlyAppointments] = await Promise.all([
      prisma.appointment.count({
        where: {
          staffId: staffMember.id,
          startTime: { gte: dayStart, lte: dayEnd },
        },
      }),
      prisma.appointment.count({
        where: {
          staffId: staffMember.id,
          startTime: { gte: monthStart, lte: monthEnd },
        },
      }),
    ])

    const completedThisMonthAppointments = await prisma.appointment.findMany({
      where: {
        staffId: staffMember.id,
        status: "COMPLETED",
        startTime: { gte: monthStart, lte: monthEnd },
      },
    })

    const monthlyEarnings = completedThisMonthAppointments.reduce(
      (sum, appointment) => sum + Number(appointment.totalPrice),
      0
    )

    return {
      success: true,
      stats: {
        todaysAppointments,
        monthlyAppointments,
        monthlyEarnings,
        completedThisMonthAppointments: completedThisMonthAppointments.length,
      },
    }
  } catch (error) {
    console.error("Error fetching staff portal stats:", error)
    return {
      success: false,
      error: "Failed to fetch staff portal stats.",
    }
  }
}

//Get Staff Today's Appointments
export const getStaffTodaysAppointments = async () => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const now = new Date()
    const dayStart = startOfDay(now)
    const dayEnd = endOfDay(now)

    const staffMember = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      include: {
        appointments: {
          where: {
            startTime: { gte: dayStart, lte: dayEnd },
            status: { in: ["CONFIRMED", "PENDING"] },
          },
          include: {
            customer: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
            services: {
              include: {
                service: {
                  select: {
                    name: true,
                    duration: true,
                    price: true,
                  },
                },
              },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    })

    if (!staffMember) {
      return {
        success: false,
        error: "Staff profile not found",
      }
    }

    return {
      success: true,
      appointments: staffMember.appointments.map((apt) => ({
        ...apt,
        totalPrice: Number(apt.totalPrice),
        customerName: apt.customer?.name || apt.guestName || "Walk-in",
        services: apt.services.map((s) => ({
          ...s,
          service: { ...s.service, price: Number(s.service.price) },
        })),
      })),
    }
  } catch (error) {
    console.error("Error fetching staff today's appointments:", error)
    return {
      success: false,
      error: "Failed to fetch staff today's appointments.",
    }
  }
}

//Get Staff Appointments
export const getStaffAppointments = async (
  filters: StaffAppointmentFilters
) => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const now = new Date()

    // Calculate date range based on filter
    let dateStart: Date | undefined
    let dateEnd: Date | undefined

    switch (filters.dateFilter) {
      case "today":
        dateStart = startOfDay(now)
        dateEnd = endOfDay(now)
        break
      case "week":
        dateStart = startOfWeek(now, { weekStartsOn: 1 })
        dateEnd = endOfWeek(now, { weekStartsOn: 1 })
        break
      case "month":
        dateStart = startOfMonth(now)
        dateEnd = endOfMonth(now)
        break
      case "all":
      default:
        // No date filter
        dateStart = undefined
        dateEnd = undefined
    }

    // Build status filter
    const statusFilter =
      filters.statusFilter && filters.statusFilter !== "ALL"
        ? filters.statusFilter
        : undefined

    // Get staff member
    const staff = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!staff) {
      return {
        success: false,
        error: "Staff profile not found",
      }
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      staffId: staff.id,
    }

    if (dateStart && dateEnd) {
      whereClause.startTime = { gte: dateStart, lte: dateEnd }
    }

    if (statusFilter) {
      whereClause.status = statusFilter
    }

    // Search filter by customer name or guest name
    if (filters.search) {
      whereClause.OR = [
        {
          customer: { name: { contains: filters.search, mode: "insensitive" } },
        },
        { guestName: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        customer: {
          select: { name: true, email: true, phone: true },
        },
        services: {
          include: {
            service: {
              select: { name: true, duration: true, price: true },
            },
          },
        },
      },
      orderBy: { startTime: "desc" },
    })

    return {
      success: true,
      appointments: appointments.map((apt) => ({
        ...apt,
        totalPrice: Number(apt.totalPrice),
        depositAmount: Number(apt.depositAmount),
        customerName: apt.customer?.name || apt.guestName || "Walk-in",
        services: apt.services.map((s) => ({
          ...s,
          service: { ...s.service, price: Number(s.service.price) },
        })),
      })),
    }
  } catch (error) {
    console.error("Error fetching staff appointments:", error)
    return {
      success: false,
      error: "Failed to fetch staff appointments.",
    }
  }
}

//Get Staff Profile
export const getStaffProfile = async () => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const staffMember = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        image: true,
        isActive: true,
        createdAt: true,
        services: {
          select: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        appointments: {
          where: { status: "COMPLETED" },
          select: { id: true },
        },
      },
    })

    if (!staffMember) {
      return {
        success: false,
        error: "Staff member not found",
      }
    }

    return {
      success: true,
      staff: {
        ...staffMember,
        totalCompletedAppointments: staffMember.appointments.length,
      },
    }
  } catch (error) {
    console.error("Error fetching staff profile:", error)
    return {
      success: false,
      error: "Failed to fetch staff profile.",
    }
  }
}

//Get Staff Assigned Services
export const getStaffAssignedServices = async () => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const staffMember = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      select: {
        services: {
          select: {
            service: {
              select: {
                id: true,
                name: true,
                duration: true,
                price: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!staffMember) {
      return {
        success: false,
        error: "Staff profile not found",
      }
    }

    return {
      success: true,
      services: staffMember.services.map((ss) => ({
        ...ss.service,
        price: Number(ss.service.price),
      })),
    }
  } catch (error) {
    console.error("Error fetching staff assigned services:", error)
    return {
      success: false,
      error: "Failed to fetch staff assigned services.",
    }
  }
}

//Update Staff Self Profile
export const updateStaffSelfProfile = async (data: StaffSelfUpdateFormData) => {
  const session = await auth()

  if (!session?.user.role || session.user.role !== "STAFF") {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    const updatedStaff = await prisma.staff.update({
      where: { userId: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        bio: data.bio,
      },
    })

    revalidatePath("/staff/profile")

    return {
      success: true,
      staff: updatedStaff,
    }
  } catch (error) {
    console.log("Error updating staff self profile:", error)
    return {
      success: false,
      error: "Failed to update staff profile.",
    }
  }
}
