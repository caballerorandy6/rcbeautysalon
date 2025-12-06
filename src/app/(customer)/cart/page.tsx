import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { CartContent } from "@/components/shop/cart-content"

export const metadata: Metadata = {
  title: "Shopping Cart | RC Beauty Salon",
  description: "Review and manage your shopping cart items.",
}

export default function CartPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="hover:bg-primary/10 hover:text-primary mb-4 -ml-2"
          asChild
        >
          <Link href="/shop">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Cart Content (Client Component) */}
        <CartContent />
      </div>
    </div>
  )
}
