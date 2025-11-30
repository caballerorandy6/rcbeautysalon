import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getUserAppointments } from "@/app/actions/appointments"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { Button } from "@/components/ui/button"
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

interface MyAppointmentsPageProps {
  searchParams: Promise<{ new?: string }>
}

export default async function MyAppointmentsPage(props: MyAppointmentsPageProps) {
  // Unwrap searchParams Promise
  const searchParams = await props.searchParams
  const newAppointmentId = searchParams.new

  // Check authentication
  const session = await auth()
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/my-appointments")
  }

  // Fetch user's appointments
  const appointments = await getUserAppointments()

  // Separate upcoming and past appointments
  const now = new Date()
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) >= now && apt.status !== "CANCELLED" && apt.status !== "COMPLETED"
  )
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) < now || apt.status === "CANCELLED" || apt.status === "COMPLETED"
  )

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/30 via-background to-muted/20 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-linear-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
            My Appointments
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your beauty appointments
          </p>
        </div>

        {/* Success message for new appointment */}
        {newAppointmentId && (
          <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
            <p className="font-semibold text-green-900 dark:text-green-100">
              ✓ Appointment Booked Successfully!
            </p>
            <p className="mt-1 text-sm text-green-800 dark:text-green-200">
              Your appointment has been created. Complete payment to confirm your booking.
            </p>
          </div>
        )}

        {/* Appointments List */}
        <AppointmentsList
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          newAppointmentId={newAppointmentId}
        />

        {/* Book New Appointment Button */}
        <div className="mt-8">
          <Link href="/services">
            <Button size="lg" className="w-full shadow-lg transition-all hover:scale-105 sm:w-auto">
              <CalendarBlank size={20} className="mr-2" weight="regular" />
              Book New Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
