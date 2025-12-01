"use server"

import { prisma } from "@/lib/prisma"

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
