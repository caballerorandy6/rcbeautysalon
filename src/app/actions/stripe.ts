"use server"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth/auth"
import { getServicesForBooking, getSalonConfig } from "./appointments"

interface CreateCheckoutSessionData {
  serviceIds: string[]
  staffId: string
  startTime: string // ISO string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  notes?: string
}

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

// Verify a checkout session (for success page)
export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    })

    return {
      success: true,
      status: session.payment_status,
      customerEmail: session.customer_email,
      metadata: session.metadata,
    }
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return {
      success: false,
      error: "Failed to verify payment session",
    }
  }
}
