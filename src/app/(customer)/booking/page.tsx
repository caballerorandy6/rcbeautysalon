import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getServiceForBooking, getAvailableStaff, getSalonConfig } from "@/app/actions/appointments"
import { BookingForm } from "@/components/booking/booking-form"

interface BookingPageProps {
  searchParams: Promise<{ service?: string }>
}

export default async function BookingPage(props: BookingPageProps) {
  // Unwrap searchParams Promise
  const searchParams = await props.searchParams
  const serviceId = searchParams.service

  // Redirect to services page if no service is selected
  if (!serviceId) {
    redirect("/services")
  }

  // Get current session
  const session = await auth()

  // Fetch all initial data on the server
  const [service, availableStaff, salonConfig] = await Promise.all([
    getServiceForBooking(serviceId),
    getAvailableStaff(serviceId),
    getSalonConfig(),
  ])

  // Redirect if service not found
  if (!service) {
    redirect("/services")
  }

  // Prepare default values for authenticated users
  const defaultValues = session?.user
    ? {
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || "",
      }
    : undefined

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/30 via-background to-muted/20 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-linear-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
            Book Your Appointment
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred time and secure your spot
          </p>
        </div>

        {/* Booking Form - Client Component with React Hook Form + Zod */}
        <BookingForm
          service={service}
          availableStaff={availableStaff}
          salonConfig={salonConfig}
          isAuthenticated={!!session?.user}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  )
}
