import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { getAppointmentById } from "@/app/actions/appointments"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils/format"
import { AppointmentStatusActions } from "@/components/appointments/status-actions"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-gray-500 text-white",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const appointment = await getAppointmentById(id)

  if (!appointment) {
    return {
      title: "Appointment Not Found",
    }
  }

  const customerName =
    appointment.customer?.name || appointment.guestName || "Guest"

  return {
    title: `Appointment - ${customerName}`,
    description: `Appointment details for ${customerName} on ${format(new Date(appointment.startTime), "MMMM d, yyyy")}`,
  }
}

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params
  const appointment = await getAppointmentById(id)

  if (!appointment) {
    notFound()
  }

  const totalDuration = appointment.services.reduce(
    (sum, s) => sum + (s.service.duration || 0),
    0
  )

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
              Booking #{appointment.id.slice(-8)}
            </p>
          </div>
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
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[appointment.status]}`}
                >
                  {appointment.status.replace("_", " ")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <AppointmentStatusActions
                appointmentId={appointment.id}
                currentStatus={appointment.status}
              />
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
              {appointment.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.service.name}</p>
                    {s.service.description && (
                      <p className="text-muted-foreground text-sm">
                        {s.service.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <CalendarIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Date</p>
                    <p className="font-medium">
                      {format(new Date(appointment.startTime), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <ClockIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Time</p>
                    <p className="font-medium">
                      {format(new Date(appointment.startTime), "h:mm a")} -{" "}
                      {format(new Date(appointment.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                Total duration: {totalDuration} minutes
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
                <p className="font-medium">
                  {appointment.customer?.name ||
                    appointment.guestName ||
                    "Guest"}
                </p>
              </div>
              <div className="space-y-2">
                {(appointment.customer?.email || appointment.guestEmail) && (
                  <div className="flex items-center gap-2 text-sm">
                    <EnvelopeIcon size={16} className="text-muted-foreground" />
                    <span>
                      {appointment.customer?.email || appointment.guestEmail}
                    </span>
                  </div>
                )}
                {(appointment.customer?.phone || appointment.guestPhone) && (
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon size={16} className="text-muted-foreground" />
                    <span>
                      {appointment.customer?.phone || appointment.guestPhone}
                    </span>
                  </div>
                )}
              </div>
              {appointment.customer?.userId && (
                <Link href={`/dashboard/users/${appointment.customer.userId}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    View Customer Profile
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Staff Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold">
                  {appointment.staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium">{appointment.staff.name}</p>
                  <p className="text-muted-foreground text-sm">Staff Member</p>
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
                <span>{formatCurrency(appointment.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Deposit</span>
                <span
                  className={
                    appointment.depositPaid
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {appointment.depositPaid
                    ? `${formatCurrency(appointment.depositAmount)} (Paid)`
                    : "Not paid"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Balance Due</span>
                <span>
                  {formatCurrency(
                    appointment.totalPrice -
                      (appointment.depositPaid ? appointment.depositAmount : 0)
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Info</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>
                Created on{" "}
                {format(new Date(appointment.createdAt), "MMMM d, yyyy")}
              </p>
              <p>Booking ID: #{appointment.id.slice(-8)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
