"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"

export async function getCustomers() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const customer = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return customer
}
