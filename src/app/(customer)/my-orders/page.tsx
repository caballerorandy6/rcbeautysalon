import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PackageIcon,
  CalendarIcon,
  ReceiptIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@/components/icons"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getCustomerOrders } from "@/app/actions/orders"

export const metadata: Metadata = {
  title: "My Orders | RC Beauty Salon",
  description: "View your order history and track your purchases.",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  PAID: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  REFUNDED: "bg-gray-500 text-white",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

export default async function MyOrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/my-orders")
  }

  const orders = await getCustomerOrders()

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
            My Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            View your purchase history and order details
          </p>
        </div>

        {/* Orders List */}
        {orders.orders?.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <ShoppingBagIcon size={32} className="text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No orders yet</h3>
              <p className="text-muted-foreground mb-6 text-center">
                When you make a purchase, your orders will appear here.
              </p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders?.orders?.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Order Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2">
                        <ReceiptIcon size={18} className="text-muted-foreground" />
                        <span className="font-semibold">{order.id}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <CalendarIcon size={16} />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                          {item.product && item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <PackageIcon
                              size={24}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Item Total */}
                        <p className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Total
                      </span>
                      <p className="text-xl font-bold">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-orders/${order.id}`}>
                        View Details
                        <ArrowRightIcon size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
