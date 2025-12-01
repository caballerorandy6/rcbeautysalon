import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  UsersIcon,
  SearchIcon,
  FilterIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const customers = [
  { id: "1", name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "(555) 123-4567", totalAppointments: 12, totalSpent: "$1,450.00", lastVisit: "Jan 15, 2024", status: "active" },
  { id: "2", name: "Michael Brown", email: "michael.brown@email.com", phone: "(555) 234-5678", totalAppointments: 8, totalSpent: "$920.00", lastVisit: "Jan 12, 2024", status: "active" },
  { id: "3", name: "Jessica Davis", email: "jessica.davis@email.com", phone: "(555) 345-6789", totalAppointments: 15, totalSpent: "$2,100.00", lastVisit: "Jan 10, 2024", status: "active" },
  { id: "4", name: "David Wilson", email: "david.wilson@email.com", phone: "(555) 456-7890", totalAppointments: 5, totalSpent: "$475.00", lastVisit: "Dec 28, 2023", status: "inactive" },
  { id: "5", name: "Emily Chen", email: "emily.chen@email.com", phone: "(555) 567-8901", totalAppointments: 20, totalSpent: "$3,200.00", lastVisit: "Jan 14, 2024", status: "active" },
  { id: "6", name: "James Rodriguez", email: "james.rodriguez@email.com", phone: "(555) 678-9012", totalAppointments: 3, totalSpent: "$210.00", lastVisit: "Jan 8, 2024", status: "active" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <Button>
          <UsersIcon size={16} className="mr-2" />
          Export List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">1,234</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active This Month</CardDescription>
            <CardTitle className="text-3xl text-green-600">456</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New This Month</CardDescription>
            <CardTitle className="text-3xl text-blue-600">32</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Visits/Customer</CardDescription>
            <CardTitle className="text-3xl">4.2</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, email, phone..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FilterIcon size={16} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>A list of all registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Appointments</th>
                  <th className="pb-3 font-medium">Total Spent</th>
                  <th className="pb-3 font-medium">Last Visit</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {customer.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <EnvelopeIcon size={12} className="text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PhoneIcon size={12} className="text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{customer.totalAppointments}</td>
                    <td className="py-4 font-medium">{customer.totalSpent}</td>
                    <td className="py-4 text-sm">{customer.lastVisit}</td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link href={`/dashboard/users/${customer.id}`}>
                        <Button variant="ghost" size="sm">
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
