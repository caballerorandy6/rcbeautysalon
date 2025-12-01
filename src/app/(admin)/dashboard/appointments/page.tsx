import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  CalendarIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const appointments = [
  { id: "1", customer: "Sarah Johnson", service: "Haircut & Styling", staff: "Emma Wilson", date: "2024-01-15", time: "9:00 AM", status: "CONFIRMED", price: "$85.00" },
  { id: "2", customer: "Michael Brown", service: "Hair Color", staff: "Sarah Miller", date: "2024-01-15", time: "10:30 AM", status: "PENDING", price: "$120.00" },
  { id: "3", customer: "Jessica Davis", service: "Manicure & Pedicure", staff: "Maria Garcia", date: "2024-01-15", time: "1:00 PM", status: "IN_PROGRESS", price: "$65.00" },
  { id: "4", customer: "David Wilson", service: "Facial Treatment", staff: "Emma Wilson", date: "2024-01-15", time: "2:30 PM", status: "COMPLETED", price: "$95.00" },
  { id: "5", customer: "Emily Chen", service: "Full Hair Treatment", staff: "Sarah Miller", date: "2024-01-16", time: "9:00 AM", status: "CANCELLED", price: "$150.00" },
  { id: "6", customer: "James Rodriguez", service: "Beard Trim", staff: "Carlos Ruiz", date: "2024-01-16", time: "11:00 AM", status: "CONFIRMED", price: "$35.00" },
]

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PROGRESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and track all salon appointments
          </p>
        </div>
        <Button>
          <PlusIcon size={16} className="mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by customer, service..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <CalendarIcon size={16} className="mr-2" />
                Date Range
              </Button>
              <Button variant="outline">
                <FilterIcon size={16} className="mr-2" />
                Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today&apos;s Appointments</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Confirmation</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">3</CardTitle>
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
            <CardDescription>Revenue Today</CardDescription>
            <CardTitle className="text-3xl">$1,245</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Click on an appointment to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Staff</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b last:border-0">
                    <td className="py-4">
                      <p className="font-medium">{apt.customer}</p>
                    </td>
                    <td className="py-4 text-sm">{apt.service}</td>
                    <td className="py-4 text-sm">{apt.staff}</td>
                    <td className="py-4 text-sm">
                      <p>{apt.date}</p>
                      <p className="text-muted-foreground">{apt.time}</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[apt.status]}`}>
                        {apt.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 font-medium">{apt.price}</td>
                    <td className="py-4">
                      <Link href={`/dashboard/appointments/${apt.id}`}>
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
