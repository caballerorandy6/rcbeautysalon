"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircleIcon, ShoppingBagIcon, HouseIcon, SpinnerIcon, ReceiptIcon } from "@/components/icons"
import { verifyProductOrder } from "@/app/actions/product-checkout"
import { useCartStore } from "@/store/cart-store"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const clearCart = useCartStore((state) => state.clearCart)

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyOrder() {
      if (!sessionId) {
        setStatus("error")
        setError("No session ID provided")
        return
      }

      const result = await verifyProductOrder(sessionId)

      if (result.success) {
        setStatus("success")
        setOrderId(result.orderId || null)
        // Clear the cart after successful payment
        clearCart()
      } else {
        setStatus("error")
        setError(result.error || "Failed to verify order")
      }
    }

    verifyOrder()
  }, [sessionId, clearCart])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <SpinnerIcon size={40} className="text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verifying Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-4xl">!</span>
            </div>
            <CardTitle className="text-2xl">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || "We couldn't verify your order. Please contact support."}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/cart">Return to Cart</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircleIcon size={48} weight="fill" className="text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold">{orderId}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            You will receive an email confirmation shortly with your order details.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {orderId && (
            <Button asChild className="w-full">
              <Link href={`/my-orders/${orderId}`}>
                <ReceiptIcon className="mr-2 h-4 w-4" />
                View Order Details
              </Link>
            </Button>
          )}
          <Button variant={orderId ? "outline" : "default"} asChild className="w-full">
            <Link href="/shop">
              <ShoppingBagIcon className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/">
              <HouseIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
