"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Trash,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr"
import { useCartStore } from "@/store/cart-store"
import { CartItem } from "@/components/shop/cart-item"
import { toast } from "sonner"
import { createProductCheckoutSession } from "@/app/actions/product-checkout"

export function CartContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const shipping = items.length === 0 || totalPrice >= 50 ? 0 : 5.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  const handleClearCart = () => {
    clearCart()
    toast.success("Your cart has been cleared!")
    setShowClearDialog(false)
  }

  const handleCheckout = async () => {
    if (status === "loading") return

    if (!session) {
      toast.error("Please log in to checkout")
      router.push("/login?callbackUrl=/cart")
      return
    }

    setIsCheckingOut(true)

    try {
      const result = await createProductCheckoutSession(items)

      if (!result.success) {
        if (result.stockErrors && result.stockErrors.length > 0) {
          result.stockErrors.forEach((error) => {
            toast.error(`${error.name}: Only ${error.available} available`)
          })
        } else {
          toast.error(result.error || "Failed to create checkout session")
        }
        return
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Header Badge */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {totalItems > 0 && (
            <Badge variant="secondary" className="text-sm">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Review and manage your items
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-border/50 bg-muted/30 flex flex-row items-center justify-between border-b">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={20} />
                Cart Items
              </CardTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClearDialog(true)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash size={16} className="mr-2" />
                  Clear Cart
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="from-primary/10 to-accent/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br">
                    <ShoppingBag
                      size={48}
                      weight="light"
                      className="text-primary/60"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground mx-auto mb-6 max-w-sm">
                    Looks like you haven&apos;t added any products yet. Start
                    shopping to fill your cart!
                  </p>
                  <Button asChild size="lg" className="shadow-md">
                    <Link href="/shop">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Browse Products
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 sticky top-24 shadow-sm">
            <CardHeader className="border-border/50 bg-muted/30 border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shipping === 0 ? (
                  <span className="font-medium text-green-600">Free</span>
                ) : (
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                )}
              </div>
              {shipping > 0 && totalPrice > 0 && (
                <p className="text-muted-foreground bg-accent/10 rounded-lg p-2 text-center text-xs">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-6 pt-0">
              <Button
                className="w-full shadow-md"
                size="lg"
                disabled={items.length === 0 || isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut ? (
                  <>
                    <CircleNotch size={20} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>

              {/* Trust Badges */}
              <div className="text-muted-foreground mt-4 flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Truck size={16} />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={16} />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmLabel="Clear Cart"
        onConfirm={handleClearCart}
        variant="destructive"
      />
    </>
  )
}
