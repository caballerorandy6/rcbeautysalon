import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { addMinutes, format } from "date-fns"
import { sendAppointmentConfirmationEmail } from "@/lib/email/appointment-confirmation"
import Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    )
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Only process if payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true })
    }

    const metadata = session.metadata

    if (!metadata) {
      console.error("No metadata in checkout session")
      return NextResponse.json({ error: "No metadata" }, { status: 400 })
    }

    try {
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
      const config = await prisma.salonConfig.findUnique({
        where: { id: "salon_config" },
      })
      const depositAmount = config?.bookingDeposit.toNumber() || 50

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
          status: "CONFIRMED", // Confirmed because payment was successful
          notes,
          totalPrice,
          depositAmount,
          depositPaid: true, // Payment was successful
          stripePaymentId: session.payment_intent as string,
          services: {
            create: serviceIds.map((serviceId: string) => ({
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

      // Send confirmation email
      const customerEmail = guestEmail || session.customer_email
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
          depositAmount,
          appointmentId: appointment.id,
        })
      }

      console.log(`Appointment created: ${appointment.id}`)
    } catch (error) {
      console.error("Error processing checkout session:", error)
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
