import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ShoppingBagIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const orders = [
  { id: "ORD-001", customer: "Sarah Johnson", email: "sarah@email.com", items: 3, total: 89.00, status: "PENDING", date: "Jan 15, 2024" },
  { id: "ORD-002", customer: "Michael Brown", email: "michael@email.com", items: 1, total: 28.00, status: "PAID", date: "Jan 15, 2024" },
  { id: "ORD-003", customer: "Jessica Davis", email: "jessica@email.com", items: 5, total: 156.00, status: "COMPLETED", date: "Jan 14, 2024" },
  { id: "ORD-004", customer: "David Wilson", email: "david@email.com", items: 2, total: 64.00, status: "COMPLETED", date: "Jan 14, 2024" },
  { id: "ORD-005", customer: "Emily Chen", email: "emily@email.com", items: 1, total: 52.00, status: "CANCELLED", date: "Jan 13, 2024" },
  { id: "ORD-006", customer: "James Rodriguez", email: "james@email.com", items: 4, total: 112.00, status: "REFUNDED", date: "Jan 12, 2024" },
]

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop Orders</h1>
          <p className="text-muted-foreground">
            Manage product orders and fulfillment
          </p>
        </div>
        <Button variant="outline">
          <ShoppingBagIcon size={16} className="mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">573</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Pickup</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Today</CardDescription>
            <CardTitle className="text-3xl text-green-600">8</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue This Month</CardDescription>
            <CardTitle className="text-3xl">$4,231</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by order ID, customer..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FilterIcon size={16} className="mr-2" />
                Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>In-store pickup orders</CardDescription>
        </CardHeader>
        <CardContent>
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
                      <p className="font-mono font-medium">{order.id}</p>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{order.items} items</td>
                    <td className="py-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{order.date}</td>
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
        </CardContent>
      </Card>
    </div>
  )
}
