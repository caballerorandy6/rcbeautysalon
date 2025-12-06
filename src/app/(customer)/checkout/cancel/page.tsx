import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCartIcon, StorefrontIcon } from "@/components/icons"

export const metadata: Metadata = {
  title: "Checkout Cancelled | RC Beauty Salon",
  description: "Your checkout was cancelled. Your cart is still saved.",
}

export default function CheckoutCancelPage() {
  return (
    <div className="from-muted/30 via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-b px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          {/* Icon */}
          <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <ShoppingCartIcon size={40} weight="light" className="text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="mb-2 text-2xl font-bold">Checkout Cancelled</h1>

          {/* Message */}
          <p className="text-muted-foreground mb-8">
            No worries! Your cart is still saved and ready when you are.
          </p>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/cart">
                <ShoppingCartIcon size={18} className="mr-2" />
                Return to Cart
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/shop">
                <StorefrontIcon size={18} className="mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Help Link */}
          <p className="text-muted-foreground mt-6 text-sm">
            Having issues?{" "}
            <Link href="/#contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
