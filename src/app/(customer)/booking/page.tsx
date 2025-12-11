import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import {
  getServiceForBooking,
  getAvailableStaff,
  getSalonConfig,
  getStaffForBooking,
  getCurrentUserStaffId,
} from "@/app/actions/appointments"
import { BookingForm } from "@/components/booking/booking-form"

interface BookingPageProps {
  searchParams: Promise<{ service?: string; staff?: string }>
}

export default async function BookingPage(props: BookingPageProps) {
  const searchParams = await props.searchParams
  const serviceSlug = searchParams.service
  const staffId = searchParams.staff

  // Get current session
  const session = await auth()

  // Prepare default values for authenticated users
  const defaultValues = session?.user
    ? {
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || "",
      }
    : undefined

  // Check if user is employee (STAFF or ADMIN)
  const isEmployee =
    session?.user?.role === "STAFF" || session?.user?.role === "ADMIN"

  // Get current user's staff ID (to prevent self-booking for employees)
  const currentUserStaffId = isEmployee ? await getCurrentUserStaffId() : null

  // Get salon config (needed for both flows)
  const salonConfig = await getSalonConfig()

  // ============================================
  // FLOW 1: Staff-first (?staff=xxx)
  // User selected a staff member first, now picks service
  // ============================================
  if (staffId) {
    // Prevent employees from booking with themselves
    if (isEmployee && currentUserStaffId === staffId) {
      redirect("/staff?error=self-booking")
    }

    const staffData = await getStaffForBooking(staffId)

    // Redirect if staff not found or inactive
    if (!staffData) {
      redirect("/staff")
    }

    // Redirect if staff has no services
    if (staffData.services.length === 0) {
      redirect("/staff")
    }

    return (
      <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
              Book with {staffData.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              Select a service and choose your preferred time
            </p>
          </div>

          {/* Booking Form - Staff-first mode */}
          <BookingForm
            mode="staff-first"
            preselectedStaff={staffData}
            staffServices={staffData.services}
            salonConfig={salonConfig}
            isAuthenticated={!!session?.user}
            isEmployee={isEmployee}
            defaultValues={defaultValues}
          />
        </div>
      </div>
    )
  }

  // ============================================
  // FLOW 2: Service-first (?service=xxx)
  // Traditional flow: service selected, now picks staff
  // ============================================
  if (!serviceSlug) {
    redirect("/services")
  }

  const service = await getServiceForBooking(serviceSlug)

  if (!service) {
    redirect("/services")
  }

  let availableStaff = await getAvailableStaff(service.id)

  // Filter out current employee from available staff (employees can't book with themselves)
  if (isEmployee && currentUserStaffId) {
    availableStaff = availableStaff.filter((s) => s.id !== currentUserStaffId)
  }

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your preferred time and secure your spot
          </p>
        </div>

        {/* Booking Form - Service-first mode (original) */}
        <BookingForm
          mode="service-first"
          service={service}
          availableStaff={availableStaff}
          salonConfig={salonConfig}
          isAuthenticated={!!session?.user}
          isEmployee={isEmployee}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  )
}
