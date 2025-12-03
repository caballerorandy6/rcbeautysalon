"use server"

import { prisma } from "@/lib/prisma"
import { CreateStaffInput } from "@/lib/interfaces"
import { revalidatePath } from "next/cache"

export type UpdateStaffInput = Partial<CreateStaffInput>

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
          service: true,
        },
      },
      workingHours: true,
    },
  })
  return staffMembers
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
          service: true,
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

  return staffMember || null
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
          service: true,
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
export const createStaffMember = async (
  data: CreateStaffInput,
  userId: string
) => {
  try {
    const staff = await prisma.staff.create({
      data: {
        ...data,
        userId,
      },
    })

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
    const updatedStaffMember = await prisma.staff.update({
      where: { id },
      data,
    })

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
