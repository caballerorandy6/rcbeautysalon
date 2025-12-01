import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CalendarIcon,
  PlusIcon,
  EyeIcon,
} from "@/components/icons"
import { getAdminAppointments } from "@/app/actions/appointments"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils/format"
import { startOfDay, endOfDay } from "date-fns"

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-gray-500 text-white",
}

export default async function AppointmentsPage() {
  const appointments = await getAdminAppointments()

  // Calculate stats
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const todaysAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.startTime)
    return aptDate >= todayStart && aptDate <= todayEnd
  })

  const pendingCount = appointments.filter(
    (apt) => apt.status === "PENDING"
  ).length

  const completedToday = todaysAppointments.filter(
    (apt) => apt.status === "COMPLETED"
  ).length

  const revenueToday = todaysAppointments
    .filter((apt) => apt.status === "COMPLETED")
    .reduce((sum, apt) => sum + apt.totalPrice, 0)

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
        <Link href="/dashboard/appointments/new">
          <Button>
            <PlusIcon size={16} className="mr-2" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today&apos;s Appointments</CardDescription>
            <CardTitle className="text-3xl">{todaysAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Confirmation</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Today</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {completedToday}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue Today</CardDescription>
            <CardTitle className="text-3xl">
              {formatCurrency(revenueToday)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>
            {appointments.length} total appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon size={48} className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No appointments yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first appointment to get started
              </p>
              <Link href="/dashboard/appointments/new">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  New Appointment
                </Button>
              </Link>
            </div>
          ) : (
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
                        <p className="font-medium">
                          {apt.customer?.name || apt.guestName || "Guest"}
                        </p>
                        {apt.customer?.phone && (
                          <p className="text-xs text-muted-foreground">
                            {apt.customer.phone}
                          </p>
                        )}
                      </td>
                      <td className="py-4 text-sm">
                        {apt.services.map((s) => s.service.name).join(", ")}
                      </td>
                      <td className="py-4 text-sm">{apt.staff.name}</td>
                      <td className="py-4 text-sm">
                        <p>{format(new Date(apt.startTime), "MMM d, yyyy")}</p>
                        <p className="text-muted-foreground">
                          {format(new Date(apt.startTime), "h:mm a")}
                        </p>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[apt.status]}`}
                        >
                          {apt.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 font-medium">
                        {formatCurrency(apt.totalPrice)}
                      </td>
                      <td className="py-4">
                        <Link href={`/dashboard/appointments/${apt.id}`}>
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
