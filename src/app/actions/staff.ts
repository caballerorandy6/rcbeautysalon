"use server"

import { prisma } from "@/lib/prisma"
import { CreateStaffInput } from "@/lib/interfaces"
import { revalidatePath } from "next/cache"

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
export const getStaffMemberBySlug = async (slug: string) => {
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
}

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
        return { success: false, error: "A staff member with this email already exists" }
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

//Delete Staff Member
export const deleteStaffMember = async (id: string) => {
  const appointmentCount = await prisma.appointment.count({
    where: { staffId: id },
  })

  if (appointmentCount > 0) {
    return {
      success: false,
      error:
        "Cannot delete staff member with existing appointments. Deactivate instead.",
    }
  }

  try {
    const deletedStaffMember = await prisma.staff.delete({
      where: { id },
    })
    revalidatePath("/dashboard/staff")
    return { success: true, staff: deletedStaffMember }
  } catch (error) {
    console.error("Error deleting staff member:", error)
    return { success: false, error: "Failed to delete staff member." }
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
