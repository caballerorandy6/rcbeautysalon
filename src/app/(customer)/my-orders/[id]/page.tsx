import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  PackageIcon,
  CalendarIcon,
  ReceiptIcon,
  ArrowLeftIcon,
  StorefrontIcon,
  CreditCardIcon,
  CheckCircleIcon,
  UserIcon,
} from "@/components/icons"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getOrderByIdForCustomer } from "@/app/actions/orders"

export const metadata: Metadata = {
  title: "Order Details | RC Beauty Salon",
  description: "View your order details.",
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

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params

  const session = await auth()

  if (!session?.user) {
    redirect("/login?redirect=/my-orders")
  }

  const order = await getOrderByIdForCustomer(id)

  if (!order) {
    redirect("/my-orders")
  }

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 -ml-2" asChild>
          <Link href="/my-orders">
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Orders
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-2">
              <ReceiptIcon size={18} />
              <span>{order.id}</span>
            </div>
          </div>
          <Badge className={`${statusColors[order.status]} px-4 py-1 text-sm`}>
            {statusLabels[order.status]}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon size={20} />
                  Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <PackageIcon size={28} className="text-muted-foreground" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground text-sm">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Item Total */}
                    <p className="text-lg font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Separator className="my-4" />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon size={20} />
                  Order Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {order.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-mono text-xs font-medium">{order.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon size={20} />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{order.customer?.name}</p>
                {order.customer?.email && (
                  <p className="text-muted-foreground">{order.customer.email}</p>
                )}
                {order.customer?.phone && (
                  <p className="text-muted-foreground">{order.customer.phone}</p>
                )}
              </CardContent>
            </Card>

            {/* Pickup Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StorefrontIcon size={20} />
                  Pickup Location
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">RC Beauty Salon</p>
                <p className="text-muted-foreground">123 Beauty Street</p>
                <p className="text-muted-foreground">New York, NY 10001</p>
                <Separator className="my-3" />
                <div className="flex items-center gap-2">
                  {order.status === "COMPLETED" ? (
                    <>
                      <CheckCircleIcon size={16} className="text-green-500" />
                      <span className="text-green-600 font-medium">Picked up</span>
                    </>
                  ) : order.status === "PAID" ? (
                    <>
                      <CheckCircleIcon size={16} className="text-blue-500" />
                      <span className="text-blue-600 font-medium">Ready for pickup</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Awaiting payment</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCardIcon size={20} />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {order.stripePaymentIntentId ? (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span className="font-medium text-green-600">Paid via card</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Pending payment</span>
                )}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="border-dashed">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  Need help with your order?
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/#contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
