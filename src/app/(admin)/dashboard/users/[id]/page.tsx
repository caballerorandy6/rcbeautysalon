import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@/components/icons"
import { getUserById, getCustomerTotalSpent } from "@/app/actions/users"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils/format"

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500 text-white",
  STAFF: "bg-blue-500 text-white",
  CLIENTE: "bg-green-500 text-white",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-gray-500 text-white",
}

const orderStatusColors: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  PAID: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  REFUNDED: "bg-gray-500 text-white",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    return {
      title: "User Not Found",
    }
  }

  return {
    title: `User - ${user.name}`,
    description: `User details for ${user.name}`,
  }
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  // Get total spent if user has a customer profile
  const totalSpent = user.customer
    ? await getCustomerTotalSpent(user.customer.id)
    : 0

  const appointments = user.customer?.appointments || []
  const orders = user.customer?.orders || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-muted-foreground">
              Member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon size={20} />
                Recent Appointments
                {appointments.length > 0 && (
                  <Badge variant="secondary">{appointments.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No appointments found
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {apt.services.map((s) => s.service.name).join(", ")}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={14} />
                            {format(new Date(apt.startTime), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon size={14} />
                            {format(new Date(apt.startTime), "h:mm a")}
                          </span>
                          <span>with {apt.staff.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[apt.status]}`}
                        >
                          {apt.status.replace("_", " ")}
                        </span>
                        <Link href={`/dashboard/appointments/${apt.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {appointments.length >= 10 && (
                    <Link
                      href={`/dashboard/appointments?customerId=${user.customer?.id}`}
                    >
                      <Button variant="link" className="w-full">
                        View All Appointments
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBagIcon size={20} />
                Recent Orders
                {orders.length > 0 && (
                  <Badge variant="secondary">{orders.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          Order #{order.id.slice(-8)}
                        </p>
                        <div className="text-muted-foreground text-sm">
                          <span>
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""} •{" "}
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-sm">
                          {order.items
                            .map((item) => item.product.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(order.total.toNumber())}
                          </p>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${orderStatusColors[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {orders.length >= 10 && (
                    <Link
                      href={`/dashboard/orders?customerId=${user.customer?.id}`}
                    >
                      <Button variant="link" className="w-full">
                        View All Orders
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon size={20} />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </div>
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <Badge className={roleColors[user.role]}>{user.role}</Badge>
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <EnvelopeIcon size={16} className="text-muted-foreground" />
                  <span>{user.email}</span>
                  {user.emailVerified && (
                    <Badge variant="outline" className="text-green-600">
                      Verified
                    </Badge>
                  )}
                </div>
                {user.customer?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon size={16} className="text-muted-foreground" />
                    <span>{user.customer.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          {user.customer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyDollarIcon size={20} />
                  Customer Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-primary text-2xl font-bold">
                      {appointments.length}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Appointments
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-primary text-2xl font-bold">
                      {orders.length}
                    </p>
                    <p className="text-muted-foreground text-xs">Orders</p>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Staff Info */}
          {user.staff && (
            <Card>
              <CardHeader>
                <CardTitle>Staff Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Position:</span>{" "}
                  <span className="font-medium">Staff Member</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge
                    variant={user.staff.isActive ? "default" : "secondary"}
                  >
                    {user.staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </p>
                {user.staff.bio && (
                  <p className="text-muted-foreground text-sm">
                    {user.staff.bio}
                  </p>
                )}
                <Link href={`/dashboard/staff/${user.staff.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    View Staff Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2 text-sm">
              <p>
                <span className="font-medium">User ID:</span>{" "}
                {user.id.slice(-8)}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {format(new Date(user.createdAt), "MMMM d, yyyy")}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {format(new Date(user.updatedAt), "MMMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
