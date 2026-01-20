"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/auth"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import {
  AvailableStaffMember,
  TimeSlot,
  CreateAppointmentData,
  AppointmentCreationResult,
} from "@/lib/interfaces"
import { addMinutes, format, parse, isAfter, isBefore } from "date-fns"
import { sendAppointmentConfirmationEmail } from "@/lib/email/appointment-confirmation"
import { Prisma } from "@prisma/client"
import { AppointmentStatus } from "@/lib/types"
import { AdminAppointmentsFilter } from "@/lib/interfaces"
import { sendNoShowNotificationEmail } from "@/lib/email/no-show-notification"
import { sendAppointmentCompletedEmail } from "@/lib/email/appointment-completed"
import { sendAppointmentCancelledEmail } from "@/lib/email/appointment-cancelled"
import { sendAppointmentRescheduledEmail } from "@/lib/email/appointment-rescheduled"
import { sendAppointmentExpiredEmail } from "@/lib/email/appointment-expired"

// Get current user's staff ID (if they are a staff member)
// Used to prevent staff from booking appointments with themselves
export async function getCurrentUserStaffId(): Promise<string | null> {
  const session = await auth()

  if (!session?.user || !["STAFF", "ADMIN"].includes(session.user.role)) {
    return null
  }

  const staff = await prisma.staff.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  return staff?.id || null
}

// Get salon configuration
export const getSalonConfig = cache(async () => {
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
      minBookingAdvance: 0,
      maxBookingAdvance: 30,
      cancellationPolicy: null,
      timezone: "America/Chicago",
    }
  }
  return {
    ...config,
    bookingDeposit: config.bookingDeposit.toNumber(),
  }
})

//Get available staff for a service
export async function getAvailableStaff(
  serviceId: string
): Promise<AvailableStaffMember[]> {
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

// Get staff member with their services for booking (staff-first flow)
export async function getStaffForBooking(staffId: string) {
  const staff = await prisma.staff.findUnique({
    where: { id: staffId, isActive: true },
    include: {
      services: {
        where: {
          service: { isActive: true },
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              price: true,
              duration: true,
              imageUrl: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!staff) return null

  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    bio: staff.bio,
    image: staff.image,
    isActive: staff.isActive,
    services: staff.services.map((s) => ({
      ...s.service,
      price: Number(s.service.price),
    })),
  }
}

//Get available time slots for a staff member on a specific date
export async function getAvailableTimeSlots(
  staffId: string,
  date: Date | string,
  serviceDuration: number
): Promise<TimeSlot[]> {
  // Ensure date is a Date object (server actions serialize Date to string)
  const dateObj = new Date(date)

  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = dateObj.getDay()

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
  const startOfDay = new Date(dateObj)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(dateObj)
  endOfDay.setHours(23, 59, 59, 999)

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      staffId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  })

  // Generate time slots
  const workStart = parse(workingHours.startTime, "HH:mm", dateObj)
  const workEnd = parse(workingHours.endTime, "HH:mm", dateObj)
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
    // Overlap formula: (startA < endB) && (endA > startB)
    const hasConflict = existingAppointments.some((apt) => {
      const aptStart = new Date(apt.startTime)
      const aptEnd = new Date(apt.endTime)
      return isBefore(currentSlot, aptEnd) && isAfter(slotEnd, aptStart)
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

//Get single service details for booking
export async function getServiceForBooking(serviceSlug: string) {
  // Fetch service details for booking page by slug
  const service = await prisma.service.findUnique({
    where: { slug: serviceSlug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
      category: {
        select: { id: true, name: true, slug: true },
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

//Get multiple services for multi-service booking
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

// Create appointment
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

    // Prevent employees from booking appointments with themselves
    if (data.isEmployee && session?.user) {
      const currentUserStaff = await prisma.staff.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (currentUserStaff && currentUserStaff.id === data.staffId) {
        return { success: false, error: "You cannot book an appointment with yourself" }
      }
    }

    // Fetch selected services and calculate totals
    const services = await getServicesForBooking(data.serviceIds)
    if (services.length === 0) {
      return { success: false, error: "Invalid service selection" }
    }

    const baseTotalPrice = services.reduce((sum, s) => sum + s.price, 0)
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)

    // Apply 20% employee discount if applicable
    const employeeDiscountRate = 0.20
    const totalPrice = data.isEmployee
      ? baseTotalPrice * (1 - employeeDiscountRate)
      : baseTotalPrice

    // Calculate appointment end time based on total duration
    const endTime = addMinutes(new Date(data.startTime), totalDuration)

    // Get salon configuration for deposit amount
    const config = await getSalonConfig()

    // Employee bookings don't require deposit
    const depositAmount = data.isEmployee ? 0 : config.bookingDeposit
    const depositPaid = data.isEmployee ? true : false // Employees don't need to pay deposit
    const appointmentStatus = data.isEmployee ? "CONFIRMED" : "PENDING"

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

    // Check if admin is creating appointment for a customer
    const isAdminCreating = session?.user?.role === "ADMIN" && data.guestName

    if (session?.user && !isAdminCreating) {
      // Regular customer booking for themselves
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
    } else if (data.guestEmail) {
      // Admin creating for a customer OR guest booking
      // Check if customer already exists by email
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: data.guestEmail },
      })

      if (existingCustomer) {
        customerId = existingCustomer.id
        // Update customer info if needed
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            name: data.guestName || existingCustomer.name,
            phone: data.guestPhone || existingCustomer.phone,
          },
        })
      } else if (data.guestName) {
        // Create new customer without linking to any user
        const customer = await prisma.customer.create({
          data: {
            name: data.guestName,
            email: data.guestEmail,
            phone: data.guestPhone,
          },
        })
        customerId = customer.id
      }
    }

    // Get staff info for the email
    const staff = await prisma.staff.findUnique({
      where: { id: data.staffId },
      select: { name: true },
    })

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
        status: appointmentStatus,
        notes: data.notes,
        totalPrice,
        depositAmount,
        depositPaid,
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

    // Send confirmation email to customer
    // If admin is creating for a customer, use guest info; otherwise use session user info
    const customerEmail = isAdminCreating
      ? data.guestEmail
      : session?.user?.email || data.guestEmail
    const customerName = isAdminCreating
      ? data.guestName
      : session?.user?.name || data.guestName || "Customer"

    if (customerEmail && customerName) {
      const serviceNames = services.map((s) => s.name).join(", ")

      // Send email in background (non-blocking)
      after(async () => {
        await sendAppointmentConfirmationEmail({
          email: customerEmail as string,
          customerName: customerName as string,
          serviceName: serviceNames,
          staffName: staff?.name || "Our Staff",
          appointmentDate: new Date(data.startTime),
          appointmentTime: format(new Date(data.startTime), "h:mm a"),
          duration: totalDuration,
          totalPrice,
          depositAmount: config.bookingDeposit,
          appointmentId: appointment.id,
        })
      })
    }

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

//Get user appointments
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
        select: { name: true, image: true, id: true },
      },
      services: {
        include: {
          service: {
            select: { slug: true, name: true, duration: true, imageUrl: true },
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

// Cancel appointment
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

//Get admin appointments with filters
export async function getAdminAppointments(filters?: AdminAppointmentsFilter) {
  const session = await auth()

  // Ensure user is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  // Automatically handle past appointments before fetching
  const now = new Date()

  // 1. Handle PENDING (unpaid) appointments - cancel and notify
  const pendingToCancel = await prisma.appointment.findMany({
    where: {
      status: "PENDING",
      endTime: { lt: now },
    },
    include: {
      customer: { select: { name: true, email: true } },
      staff: { select: { name: true } },
      services: { include: { service: { select: { name: true } } } },
    },
  })

  for (const apt of pendingToCancel) {
    const customerEmail = apt.customer?.email || apt.guestEmail
    const customerName = apt.customer?.name || apt.guestName || "Customer"

    if (customerEmail) {
      // Send email in background (non-blocking)
      after(async () => {
        await sendAppointmentExpiredEmail({
          email: customerEmail,
          customerName,
          serviceName: apt.services.map((s) => s.service.name).join(", "),
          staffName: apt.staff?.name || "Our Staff",
          appointmentDate: apt.startTime,
          appointmentTime: format(apt.startTime, "h:mm a"),
          depositAmount: apt.depositAmount.toNumber(),
        })
      })
    }
  }

  await prisma.appointment.updateMany({
    where: {
      status: "PENDING",
      endTime: { lt: now },
    },
    data: { status: "CANCELLED" },
  })

  // 2. Handle CONFIRMED (paid) appointments - mark as NO_SHOW
  const confirmedToNoShow = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      endTime: { lt: now },
    },
    include: {
      customer: { select: { name: true, email: true } },
      staff: { select: { name: true } },
      services: { include: { service: { select: { name: true } } } },
    },
  })

  for (const apt of confirmedToNoShow) {
    const customerEmail = apt.customer?.email || apt.guestEmail
    const customerName = apt.customer?.name || apt.guestName || "Customer"

    if (customerEmail) {
      // Send email in background (non-blocking)
      after(async () => {
        await sendNoShowNotificationEmail({
          email: customerEmail,
          customerName,
          serviceName: apt.services.map((s) => s.service.name).join(", "),
          staffName: apt.staff?.name || "Our Staff",
          appointmentDate: apt.startTime,
          appointmentTime: format(apt.startTime, "h:mm a"),
          depositAmount: apt.depositAmount.toNumber(),
          appointmentId: apt.id,
        })
      })
    }
  }

  await prisma.appointment.updateMany({
    where: {
      status: "CONFIRMED",
      endTime: { lt: now },
    },
    data: { status: "NO_SHOW" },
  })

  // Build where clause based on filters
  const where: Prisma.AppointmentWhereInput = {}

  // Apply status filter
  if (filters?.status) {
    where.status = filters.status
  }

  // Apply staff filter
  if (filters?.staffId) {
    where.staffId = filters.staffId
  }

  // Apply date range filter
  if (filters?.dateFrom || filters?.dateTo) {
    where.startTime = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    }
  }

  // Apply search filter (by customer name)
  if (filters?.search) {
    where.OR = [
      { customer: { name: { contains: filters.search, mode: "insensitive" } } },
      { guestName: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  // Fetch appointments with applied filters
  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      staff: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true, phone: true } },
      services: {
        include: {
          service: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { startTime: "desc" },
  })

  // Convert Prisma Decimals to numbers for price fields
  return appointments.map((apt) => ({
    ...apt,
    totalPrice: apt.totalPrice.toNumber(),
    depositAmount: apt.depositAmount.toNumber(),
  }))
}

// Cached version to avoid duplicate fetches in generateMetadata + page component
export const getAppointmentById = cache(async (id: string) => {
  const session = await auth()

  // Ensure user is authenticated
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      staff: { select: { id: true, name: true, email: true, phone: true } },
      customer: {
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      services: {
        include: {
          service: {
            select: { id: true, name: true, description: true, duration: true },
          },
        },
      },
    },
  })

  if (!appointment) {
    return null
  }

  // Convert Prisma Decimals to numbers for price fields
  return {
    ...appointment,
    totalPrice: appointment.totalPrice.toNumber(),
    depositAmount: appointment.depositAmount.toNumber(),
  }
})

// Mark past appointments as NO_SHOW
export async function markNoShowAppointments() {
  const session = await auth()

  // Only allow admins to run this
  if (!session?.user || session.user.role !== "ADMIN") {
    return { updated: 0 }
  }

  const now = new Date()

  // Find and update all PENDING or CONFIRMED appointments where endTime has passed
  const result = await prisma.appointment.updateMany({
    where: {
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      endTime: {
        lt: now,
      },
    },
    data: {
      status: "NO_SHOW",
    },
  })

  if (result.count > 0) {
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/appointments")
  }

  return { updated: result.count }
}

// Update appointment status
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  const session = await auth()

  // Ensure user is authenticated (ADMIN or STAFF can update)
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    throw new Error("Unauthorized")
  }

  // Get appointment details before updating (for email)
  const appointmentDetails = await prisma.appointment.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, email: true } },
      staff: { select: { name: true } },
      services: {
        include: {
          service: { select: { id: true, name: true, duration: true } },
        },
      },
    },
  })

  if (!appointmentDetails) {
    throw new Error("Appointment not found")
  }

  // Update appointment status
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
  })

  // Send email notification based on new status
  const customerEmail =
    appointmentDetails.customer?.email || appointmentDetails.guestEmail
  const customerName =
    appointmentDetails.customer?.name ||
    appointmentDetails.guestName ||
    "Customer"
  const serviceName = appointmentDetails.services
    .map((s) => s.service.name)
    .join(", ")
  const staffName = appointmentDetails.staff?.name || "Our Staff"

  if (customerEmail) {
    // Calculate total duration from appointment services
    const totalDuration = appointmentDetails.services.reduce(
      (sum, s) => sum + s.service.duration,
      0
    )

    // Send email in background (non-blocking)
    switch (status) {
      case "CONFIRMED":
        after(async () => {
          await sendAppointmentConfirmationEmail({
            email: customerEmail,
            customerName,
            serviceName,
            staffName,
            appointmentDate: appointmentDetails.startTime,
            appointmentTime: format(appointmentDetails.startTime, "h:mm a"),
            duration: totalDuration,
            totalPrice: appointmentDetails.totalPrice.toNumber(),
            depositAmount: appointmentDetails.depositAmount.toNumber(),
            appointmentId: id,
          })
        })
        break

      case "COMPLETED":
        after(async () => {
          await sendAppointmentCompletedEmail({
            email: customerEmail,
            customerName,
            serviceName,
            staffName,
            appointmentDate: appointmentDetails.startTime,
            appointmentTime: format(appointmentDetails.startTime, "h:mm a"),
            totalPrice: appointmentDetails.totalPrice.toNumber(),
            appointmentId: id,
          })
        })
        break

      case "CANCELLED":
        after(async () => {
          await sendAppointmentCancelledEmail({
            email: customerEmail,
            customerName,
            serviceName,
            staffName,
            appointmentDate: appointmentDetails.startTime,
            appointmentTime: format(appointmentDetails.startTime, "h:mm a"),
            appointmentId: id,
            cancelledByAdmin: true,
          })
        })
        break

      case "NO_SHOW":
        after(async () => {
          await sendNoShowNotificationEmail({
            email: customerEmail,
            customerName,
            serviceName,
            staffName,
            appointmentDate: appointmentDetails.startTime,
            appointmentTime: format(appointmentDetails.startTime, "h:mm a"),
            depositAmount: appointmentDetails.depositAmount.toNumber(),
            appointmentId: id,
          })
        })
        break
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/appointments")

  return {
    ...appointment,
    totalPrice: appointment.totalPrice.toNumber(),
    depositAmount: appointment.depositAmount.toNumber(),
  }
}

export async function rescheduleAppointment(
  appointmentId: string,
  newStartTime: Date
) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to reschedule appointments",
    }
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      customer: {
        include: {
          user: true,
        },
      },
      staff: { select: { name: true, id: true } },
      services: {
        include: {
          service: { select: { name: true, duration: true } },
        },
      },
    },
  })

  if (!appointment) {
    return {
      success: false,
      error: "Appointment not found",
    }
  }

  // Check permissions: owner or admin
  const isAdmin = session.user.role === "ADMIN"
  const isOwner = appointment.customer?.userId === session.user.id

  if (!isAdmin && !isOwner) {
    return {
      success: false,
      error: "You don't have permission to reschedule this appointment",
    }
  }

  // Validate status
  if (appointment.status === "CANCELLED" || appointment.status === "NO_SHOW") {
    return {
      success: false,
      error: "You cannot reschedule a cancelled or no-show appointment",
    }
  }

  // Validate original appointment is not in the past
  if (new Date(appointment.startTime) < new Date()) {
    return {
      success: false,
      error: "Cannot reschedule past appointments",
    }
  }

  // Validate new time is not in the past
  if (newStartTime < new Date()) {
    return {
      success: false,
      error: "Cannot reschedule to a past time",
    }
  }

  const totalDuration = appointment.services.reduce(
    (sum, s) => sum + s.service.duration,
    0
  )

  const newEndTime = addMinutes(newStartTime, totalDuration)

  const slots = await getAvailableTimeSlots(
    appointment.staffId,
    newStartTime,
    totalDuration
  )

  const requestedTime = format(newStartTime, "HH:mm")
  const slotAvailable = slots.find(
    (slot) => slot.time === requestedTime && slot.available
  )

  if (!slotAvailable) {
    return {
      success: false,
      error: "Selected time slot is not available",
    }
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      startTime: newStartTime,
      endTime: newEndTime,
    },
  })

  revalidatePath("/my-appointments")
  revalidatePath("/dashboard/appointments")

  const customerEmail = appointment.customer?.email || appointment.guestEmail
  const customerName =
    appointment.customer?.name || appointment.guestName || "Customer"
  const serviceName = appointment.services.map((s) => s.service.name).join(", ")
  const staffName = appointment.staff?.name || "Our Staff"

  if (customerEmail) {
    // Send email in background (non-blocking)
    after(async () => {
      await sendAppointmentRescheduledEmail({
        email: customerEmail,
        customerName,
        serviceName,
        staffName,
        oldDate: appointment.startTime,
        oldTime: format(appointment.startTime, "h:mm a"),
        newDate: newStartTime,
        newTime: format(newStartTime, "h:mm a"),
        duration: totalDuration,
      })
    })
  }

  return {
    success: true,
  }
}
