import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ScissorsIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const appointment = {
  id: "1",
  customer: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
  },
  service: {
    name: "Haircut & Styling",
    duration: 60,
    price: 85.00,
  },
  staff: {
    name: "Emma Wilson",
    image: null,
  },
  date: "January 15, 2024",
  time: "9:00 AM",
  endTime: "10:00 AM",
  status: "CONFIRMED",
  depositPaid: true,
  depositAmount: 50.00,
  totalPrice: 85.00,
  notes: "Customer prefers layered cut with slight highlights",
  createdAt: "January 10, 2024",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PROGRESS: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

export default function AppointmentDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Appointment Details</h1>
            <p className="text-muted-foreground">
              Booking #{appointment.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Cancel Appointment</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Status</CardTitle>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[appointment.status]}`}>
                  {appointment.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Mark as Confirmed</Button>
                <Button variant="outline" size="sm">Start Service</Button>
                <Button variant="outline" size="sm">Mark Complete</Button>
                <Button variant="outline" size="sm">No Show</Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScissorsIcon size={20} />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{appointment.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {appointment.service.duration} minutes
                  </p>
                </div>
                <p className="text-xl font-bold">${appointment.service.price.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{appointment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ClockIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{appointment.time} - {appointment.endTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {appointment.notes || "No notes for this appointment"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon size={20} />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{appointment.customer.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <EnvelopeIcon size={16} className="text-muted-foreground" />
                  <span>{appointment.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon size={16} className="text-muted-foreground" />
                  <span>{appointment.customer.phone}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View Customer Profile
              </Button>
            </CardContent>
          </Card>

          {/* Staff Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {appointment.staff.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium">{appointment.staff.name}</p>
                  <p className="text-sm text-muted-foreground">Stylist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrencyDollarIcon size={20} />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Service Total</span>
                <span>${appointment.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Deposit Paid</span>
                <span className={appointment.depositPaid ? "text-green-600" : "text-yellow-600"}>
                  {appointment.depositPaid ? `$${appointment.depositAmount.toFixed(2)}` : "Not paid"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Balance Due</span>
                <span>${(appointment.totalPrice - (appointment.depositPaid ? appointment.depositAmount : 0)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Created on {appointment.createdAt}</p>
              <p>Booking ID: #{appointment.id}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
