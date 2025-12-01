"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"
import { revalidatePath } from "next/cache"
import {
  AvailableStaffMember,
  TimeSlot,
  CreateAppointmentData,
  AppointmentCreationResult,
} from "@/lib/interfaces"
import { addMinutes, format, parse, isAfter, isBefore } from "date-fns"

export async function getSalonConfig() {
  const config = await prisma.salonConfig.findUnique({
    where: { id: "salon_config" },
    select: {
      bookingDeposit: true,
      depositRefundable: true,
      minBookingAdvance: true,
      maxBookingAdvance: true,
      cancellationPolicy: true,
      timezone: true,
    },
  })
  if (!config) {
    return {
      bookingDeposit: 50,
      depositRefundable: false,
      minBookingAdvance: 24,
      maxBookingAdvance: 30,
      cancellationPolicy: null,
      timezone: "America/New_York",
    }
  }
  return {
    ...config,
    bookingDeposit: config.bookingDeposit.toNumber(),
  }
}

// ============================================
// 2. GET AVAILABLE STAFF FOR SERVICE
// ============================================
export async function getAvailableStaff(
  serviceId: string
): Promise<AvailableStaffMember[]> {
  /**
   * INDICACIONES:
   *
   * 1. Query a prisma.staffService.findMany()
   * 2. Where:
   *    - serviceId: el serviceId recibido
   *    - staff: { isActive: true }
   *
   * 3. Include:
   *    - staff: {
   *        select: {
   *          id, name, email, phone, bio, image, isActive
   *        }
   *      }
   *
   * 4. Mapear el resultado para retornar solo el array de staff:
   *    staffServices.map((ss) => ss.staff)
   *
   * 5. Retornar el array de AvailableStaffMember
   */
  const availableStaff = await prisma.staffService.findMany({
    where: {
      serviceId,
      staff: { isActive: true },
    },
    include: {
      staff: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          image: true,
          isActive: true,
        },
      },
    },
  })
  return availableStaff.map((s) => s.staff)
}

// ============================================
// 3. GET AVAILABLE TIME SLOTS
// ============================================
export async function getAvailableTimeSlots(
  staffId: string,
  date: Date,
  serviceDuration: number
): Promise<TimeSlot[]> {
  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay()

  // Find working hours for this staff on this day
  const workingHours = await prisma.workingHours.findFirst({
    where: {
      staffId,
      dayOfWeek,
      isActive: true,
    },
  })

  if (!workingHours) {
    return [] // Staff doesn't work on this day
  }

  // Get existing appointments for this day
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      staffId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  })

  // Generate time slots
  const workStart = parse(workingHours.startTime, "HH:mm", date)
  const workEnd = parse(workingHours.endTime, "HH:mm", date)
  const slots: TimeSlot[] = []
  let currentSlot = workStart

  // Loop through working hours creating 30-minute slots
  while (isBefore(currentSlot, workEnd)) {
    const slotEnd = addMinutes(currentSlot, serviceDuration)

    // Check if slot fits within working hours
    if (isAfter(slotEnd, workEnd)) {
      break
    }

    // Check for conflicts with existing appointments
    const hasConflict = existingAppointments.some((apt) => {
      const aptStart = new Date(apt.startTime)
      const aptEnd = new Date(apt.endTime)
      return (
        (isAfter(currentSlot, aptStart) && isBefore(currentSlot, aptEnd)) ||
        (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
        (isBefore(currentSlot, aptStart) && isAfter(slotEnd, aptEnd))
      )
    })

    // Check if slot is in the past
    const isPast = isBefore(currentSlot, new Date())

    // Add slot to array
    slots.push({
      time: format(currentSlot, "HH:mm"),
      formattedTime: format(currentSlot, "h:mm a"),
      available: !hasConflict && !isPast,
    })

    // Move to next slot (30-minute intervals)
    currentSlot = addMinutes(currentSlot, 30)
  }

  return slots
}

// ============================================
// 4. GET SERVICE FOR BOOKING
// ============================================
export async function getServiceForBooking(serviceId: string) {
  // Fetch service details for booking page
  const service = await prisma.service.findUnique({
    where: { id: serviceId, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
      category: {
        select: { name: true },
      },
    },
  })

  // Return null if service doesn't exist or is inactive
  if (!service) {
    return null
  }

  // Convert Prisma Decimal to number for price
  return {
    ...service,
    price: service.price.toNumber(),
  }
}

// ============================================
// 5. GET MULTIPLE SERVICES FOR BOOKING
// ============================================
export async function getServicesForBooking(serviceIds: string[]) {
  // Fetch multiple services for multi-service appointments
  const services = await prisma.service.findMany({
    where: {
      id: { in: serviceIds },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
    },
  })

  // Convert Prisma Decimal prices to numbers
  return services.map((s) => ({
    ...s,
    price: s.price.toNumber(),
  }))
}

// ============================================
// 6. CREATE APPOINTMENT (MOST IMPORTANT)
// ============================================
export async function createAppointment(
  data: CreateAppointmentData
): Promise<AppointmentCreationResult> {
  try {
    // Get current session to identify if user is authenticated
    const session = await auth()

    // Validate required fields
    if (!data.staffId || !data.serviceIds.length || !data.startTime) {
      return { success: false, error: "Missing required fields" }
    }

    // Validate customer information (either authenticated user OR guest info)
    if (!session?.user && (!data.guestName || !data.guestEmail)) {
      return { success: false, error: "Customer information is required" }
    }

    // Fetch selected services and calculate totals
    const services = await getServicesForBooking(data.serviceIds)
    if (services.length === 0) {
      return { success: false, error: "Invalid service selection" }
    }

    const totalPrice = services.reduce((sum, s) => sum + s.price, 0)
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)

    // Calculate appointment end time based on total duration
    const endTime = addMinutes(new Date(data.startTime), totalDuration)

    // Get salon configuration for deposit amount
    const config = await getSalonConfig()

    // Verify the requested time slot is available
    const slots = await getAvailableTimeSlots(
      data.staffId,
      new Date(data.startTime),
      totalDuration
    )
    const requestedTime = format(new Date(data.startTime), "HH:mm")
    const slotAvailable = slots.find(
      (slot) => slot.time === requestedTime && slot.available
    )

    if (!slotAvailable) {
      return { success: false, error: "Selected time slot is not available" }
    }

    // Handle customer creation/retrieval
    let customerId: string | null = null

    if (session?.user) {
      // Check if authenticated user has a customer profile
      const userWithCustomer = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { customer: true },
      })

      if (userWithCustomer?.customer) {
        // Use existing customer profile
        customerId = userWithCustomer.customer.id
      } else {
        // Create new customer profile for authenticated user
        const customer = await prisma.customer.create({
          data: {
            name: session.user.name || data.guestName || "Customer",
            email: session.user.email || data.guestEmail,
            phone: data.guestPhone,
            userId: session.user.id,
          },
        })
        customerId = customer.id
      }
    }

    // Create the appointment with associated services
    const appointment = await prisma.appointment.create({
      data: {
        staffId: data.staffId,
        customerId,
        // Guest info only used for non-authenticated bookings
        guestName: !customerId ? data.guestName : null,
        guestEmail: !customerId ? data.guestEmail : null,
        guestPhone: !customerId ? data.guestPhone : null,
        startTime: new Date(data.startTime),
        endTime,
        status: "PENDING",
        notes: data.notes,
        totalPrice,
        depositAmount: config.bookingDeposit,
        depositPaid: false,
        // Create appointment-service relationships
        services: {
          create: data.serviceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    })

    // Revalidate paths to update UI with new appointment
    revalidatePath("/my-appointments")
    revalidatePath("/dashboard")

    // Return success with appointment ID
    return {
      success: true,
      appointmentId: appointment.id,
    }
  } catch (error) {
    console.error("Error creating appointment:", error)
    return {
      success: false,
      error: "Failed to create appointment. Please try again.",
    }
  }
}

// ============================================
// 7. GET USER APPOINTMENTS
// ============================================
export async function getUserAppointments() {
  // Get current session
  const session = await auth()
  if (!session?.user) {
    return [] // User not authenticated
  }

  // Find user with customer profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { customer: true },
  })

  if (!user?.customer) {
    return [] // User doesn't have a customer profile
  }

  // Fetch all appointments for this customer
  const appointments = await prisma.appointment.findMany({
    where: { customerId: user.customer.id },
    include: {
      staff: {
        select: { name: true, image: true },
      },
      services: {
        include: {
          service: {
            select: { name: true, duration: true, imageUrl: true },
          },
        },
      },
    },
    orderBy: { startTime: "desc" }, // Most recent first
  })

  // Convert Prisma Decimals to numbers for price fields
  return appointments.map((apt) => ({
    ...apt,
    totalPrice: apt.totalPrice.toNumber(),
    depositAmount: apt.depositAmount.toNumber(),
  }))
}

// ============================================
// 8. CANCEL APPOINTMENT
// ============================================
export async function cancelAppointment(appointmentId: string) {
  try {
    // Verify user is authenticated
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to cancel appointments",
      }
    }

    // Find appointment and verify ownership
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: {
          include: { user: true },
        },
      },
    })

    // Validate appointment exists
    if (!appointment) {
      return { success: false, error: "Appointment not found" }
    }

    // Validate user owns this appointment
    if (appointment.customer?.userId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to cancel this appointment",
      }
    }

    // Update appointment status to CANCELLED
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    })

    // Revalidate paths to update UI
    revalidatePath("/my-appointments")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return {
      success: false,
      error: "Failed to cancel appointment. Please try again.",
    }
  }
}
