"use server"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { validateCartStock } from "./cart"
import type { CartItem } from "@/store/cart-store"

const TAX_RATE = 0.08
const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 5.99

interface CheckoutResult {
  success: boolean
  checkoutUrl?: string
  error?: string
  stockErrors?: Array<{
    productId: string
    name: string
    available: number
    requested: number
  }>
}

export async function createProductCheckoutSession(
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    // Get current session
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to checkout",
      }
    }

    if (items.length === 0) {
      return {
        success: false,
        error: "Your cart is empty",
      }
    }

    // Validate stock
    const stockValidation = await validateCartStock(items)
    if (!stockValidation.valid) {
      return {
        success: false,
        error: "Some items are out of stock",
        stockErrors: stockValidation.errors,
      }
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = subtotal * TAX_RATE
    const total = subtotal + shipping + tax

    // Get or create customer
    let customerId: string | null = null
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { customer: true },
    })

    if (user?.customer) {
      customerId = user.customer.id
    } else if (user) {
      const customer = await prisma.customer.create({
        data: {
          name: user.name || "Customer",
          email: user.email,
          userId: user.id,
        },
      })
      customerId = customer.id
    }

    // Create order in database with PENDING status
    const order = await prisma.order.create({
      data: {
        customerId,
        subtotal,
        tax,
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            images: [],
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email || undefined,
      line_items: lineItems,
      automatic_tax: { enabled: false }, // We calculate tax ourselves
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        type: "product_order",
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    })

    return {
      success: true,
      checkoutUrl: checkoutSession.url || undefined,
    }
  } catch (error) {
    console.error("Error creating product checkout session:", error)
    return {
      success: false,
      error: "Failed to create payment session. Please try again.",
    }
  }
}

// Verify payment and update order status
export async function verifyProductOrder(sessionId: string) {
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

    const orderId = checkoutSession.metadata?.orderId
    if (!orderId) {
      return {
        success: false,
        error: "Order not found",
      }
    }

    // Get payment intent ID
    const paymentIntentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent?.id

    // Check if order is already marked as paid
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!existingOrder) {
      return {
        success: false,
        error: "Order not found",
      }
    }

    if (existingOrder.status === "PAID") {
      return {
        success: true,
        orderId: existingOrder.id,
        alreadyProcessed: true,
      }
    }

    // Update order status and reduce stock
    await prisma.$transaction(async (tx) => {
      // Update order
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentIntentId: paymentIntentId,
        },
      })

      // Reduce stock for each item
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        })
      }
    })

    return {
      success: true,
      orderId: orderId,
      alreadyProcessed: false,
    }
  } catch (error) {
    console.error("Error verifying product order:", error)
    return {
      success: false,
      error: "Failed to verify order",
    }
  }
}
