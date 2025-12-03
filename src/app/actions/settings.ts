"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { SalonSettingsInput } from "@/lib/interfaces"

// Get salon settings (create default if not exists)
export async function getSalonSettings() {
  let settings = await prisma.salonConfig.findUnique({
    where: { id: "salon_config" },
  })

  // Create default settings if not exists
  if (!settings) {
    settings = await prisma.salonConfig.create({
      data: {
        id: "salon_config",
        name: "Beauty Salon",
      },
    })
  }

  return {
    ...settings,
    bookingDeposit: settings.bookingDeposit.toNumber(),
  }
}

// Update salon settings
export async function updateSalonSettings(data: SalonSettingsInput) {
  try {
    const settings = await prisma.salonConfig.upsert({
      where: { id: "salon_config" },
      update: {
        ...data,
        bookingDeposit: data.bookingDeposit,
      },
      create: {
        id: "salon_config",
        name: data.name || "Beauty Salon",
        ...data,
        bookingDeposit: data.bookingDeposit,
      },
    })

    revalidatePath("/dashboard/settings")
    revalidatePath("/")

    return {
      success: true,
      settings: {
        ...settings,
        bookingDeposit: settings.bookingDeposit.toNumber(),
      },
    }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings." }
  }
}

// Reset settings to defaults
export async function resetSalonSettings() {
  try {
    await prisma.salonConfig.delete({
      where: { id: "salon_config" },
    })

    const settings = await prisma.salonConfig.create({
      data: {
        id: "salon_config",
        name: "Beauty Salon",
      },
    })

    revalidatePath("/dashboard/settings")
    revalidatePath("/")

    return {
      success: true,
      settings: {
        ...settings,
        bookingDeposit: settings.bookingDeposit.toNumber(),
      },
    }
  } catch (error) {
    console.error("Error resetting settings:", error)
    return { success: false, error: "Failed to reset settings." }
  }
}
