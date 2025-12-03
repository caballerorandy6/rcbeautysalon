"use server"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { addMinutes, format } from "date-fns"
import { getServicesForBooking, getSalonConfig } from "./appointments"
import { CreateCheckoutSessionData } from "@/lib/interfaces"
import { sendAppointmentConfirmationEmail } from "@/lib/email/appointment-confirmation"

export async function createCheckoutSession(data: CreateCheckoutSessionData) {
  try {
    // Get current session
    const session = await auth()

    // Validate required fields
    if (!data.staffId || !data.serviceIds.length || !data.startTime) {
      return { success: false, error: "Missing required fields" }
    }

    // Validate customer information
    if (!session?.user && (!data.guestName || !data.guestEmail)) {
      return { success: false, error: "Customer information is required" }
    }

    // Fetch services to get names and calculate totals
    const services = await getServicesForBooking(data.serviceIds)
    if (services.length === 0) {
      return { success: false, error: "Invalid service selection" }
    }

    // Get salon config for deposit amount
    const config = await getSalonConfig()

    // Create service names string
    const serviceNames = services.map((s) => s.name).join(", ")

    // Customer email for Stripe
    const customerEmail = session?.user?.email || data.guestEmail
    const customerName = session?.user?.name || data.guestName || "Customer"

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment Deposit - ${serviceNames}`,
              description: `Non-refundable deposit for your appointment`,
            },
            unit_amount: Math.round(config.bookingDeposit * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        // Store booking data in metadata for webhook
        serviceIds: JSON.stringify(data.serviceIds),
        staffId: data.staffId,
        startTime: data.startTime,
        guestName: data.guestName || "",
        guestEmail: data.guestEmail || "",
        guestPhone: data.guestPhone || "",
        notes: data.notes || "",
        userId: session?.user?.id || "",
        customerName,
      },
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/cancel`,
    })

    return {
      success: true,
      checkoutUrl: checkoutSession.url,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return {
      success: false,
      error: "Failed to create payment session. Please try again.",
    }
  }
}

// Verify and create appointment from checkout session (fallback for webhook)
export async function verifyAndCreateAppointment(sessionId: string) {
  try {
    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    })

    // Verify payment was successful
    if (checkoutSession.payment_status !== "paid") {
      return {
        success: false,
        error: "Payment not completed",
      }
    }

    // payment_intent can be string or object depending on expand
    const paymentIntentId = typeof checkoutSession.payment_intent === 'string'
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id

    if (!paymentIntentId) {
      return {
        success: false,
        error: "No payment intent found",
      }
    }

    const metadata = checkoutSession.metadata

    if (!metadata) {
      return {
        success: false,
        error: "No booking data found",
      }
    }

    // Check if appointment already exists (webhook might have created it)
    const existingAppointment = await prisma.appointment.findFirst({
      where: { stripePaymentId: paymentIntentId },
    })

    if (existingAppointment) {
      // Appointment already created by webhook
      return {
        success: true,
        appointmentId: existingAppointment.id,
        alreadyExists: true,
        customerEmail: checkoutSession.customer_email,
      }
    }

    // Parse metadata
    const serviceIds = JSON.parse(metadata.serviceIds || "[]")
    const staffId = metadata.staffId
    const startTime = new Date(metadata.startTime)
    const guestName = metadata.guestName || null
    const guestEmail = metadata.guestEmail || null
    const guestPhone = metadata.guestPhone || null
    const notes = metadata.notes || null
    const userId = metadata.userId || null
    const customerName = metadata.customerName || "Customer"

    // Get services for duration calculation
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true, duration: true, price: true },
    })

    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)
    const totalPrice = services.reduce(
      (sum, s) => sum + s.price.toNumber(),
      0
    )
    const endTime = addMinutes(startTime, totalDuration)

    // Get salon config
    const config = await getSalonConfig()

    // Handle customer creation/retrieval
    let customerId: string | null = null

    if (userId) {
      // Check if user has a customer profile
      const userWithCustomer = await prisma.user.findUnique({
        where: { id: userId },
        include: { customer: true },
      })

      if (userWithCustomer?.customer) {
        customerId = userWithCustomer.customer.id
      } else if (userWithCustomer) {
        // Create customer profile
        const customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: userWithCustomer.email,
            phone: guestPhone,
            userId: userId,
          },
        })
        customerId = customer.id
      }
    } else if (guestEmail) {
      // Guest booking - check if customer exists
      const existingCustomer = await prisma.customer.findFirst({
        where: { email: guestEmail },
      })

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else if (guestName) {
        // Create new customer
        const customer = await prisma.customer.create({
          data: {
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
          },
        })
        customerId = customer.id
      }
    }

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { name: true },
    })

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        staffId,
        customerId,
        guestName: !customerId ? guestName : null,
        guestEmail: !customerId ? guestEmail : null,
        guestPhone: !customerId ? guestPhone : null,
        startTime,
        endTime,
        status: "CONFIRMED",
        notes,
        totalPrice,
        depositAmount: config.bookingDeposit,
        depositPaid: true,
        stripePaymentId: paymentIntentId,
        services: {
          create: serviceIds.map((serviceId: string) => ({
            serviceId,
          })),
        },
      },
    })

    // Send confirmation email
    const customerEmail = guestEmail || checkoutSession.customer_email
    if (customerEmail) {
      const serviceNames = services.map((s) => s.name).join(", ")

      await sendAppointmentConfirmationEmail({
        email: customerEmail,
        customerName,
        serviceName: serviceNames,
        staffName: staff?.name || "Our Staff",
        appointmentDate: startTime,
        appointmentTime: format(startTime, "h:mm a"),
        duration: totalDuration,
        totalPrice,
        depositAmount: config.bookingDeposit,
        appointmentId: appointment.id,
      })
    }

    return {
      success: true,
      appointmentId: appointment.id,
      alreadyExists: false,
      customerEmail: customerEmail,
    }
  } catch (error) {
    console.error("Error creating appointment from checkout:", error)
    return {
      success: false,
      error: "Failed to create appointment",
    }
  }
}
