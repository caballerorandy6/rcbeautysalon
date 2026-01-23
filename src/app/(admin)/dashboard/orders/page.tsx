import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon } from "@/components/icons"
import { getAdminOrders, getOrderStats } from "@/app/actions/orders"
import { OrderSearch } from "@/components/dashboard/order-search"
import { ExportOrdersButton } from "@/components/dashboard/export-orders-button"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

interface OrdersPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { search } = await searchParams
  const [orders, stats] = await Promise.all([
    getAdminOrders(search),
    getOrderStats(),
  ])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Shop{" "}
            <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
              Orders
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage product orders and fulfillment
          </p>
        </div>
        <ExportOrdersButton orders={orders} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{stats.totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Pickup</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Today</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completedToday}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue This Month</CardDescription>
            <CardTitle className="text-3xl">${stats.revenueThisMonth.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <OrderSearch />

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>In-store pickup orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-4">
                        <p className="font-mono font-medium text-sm">{order.id.slice(0, 8)}...</p>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium">
                            {order.customer?.name || order.guestName || "Guest"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer?.email || order.guestEmail || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{order._count.items} items</td>
                      <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <EyeIcon size={16} className="mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
