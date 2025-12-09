import type { Metadata } from "next"
import { StaffAppointmentsFilter } from "@/components/staff/staff-appointments-filter"
import { StaffAppointmentsList } from "@/components/staff/staff-appointments-list"
import { getStaffAppointments } from "@/app/actions/staff"

export const metadata: Metadata = {
  title: "My Appointments | Staff Portal",
  description: "View and manage your appointments",
}

interface StaffAppointmentsProps {
  searchParams: Promise<{
    dateFilter: string
    statusFilter: string
    search: string
  }>
}

export default async function StaffAppointmentsPage({
  searchParams,
}: StaffAppointmentsProps) {
  const params = await searchParams

  const filters = {
    dateFilter: params.dateFilter as
      | "today"
      | "week"
      | "month"
      | "all"
      | undefined,
    statusFilter: params.statusFilter as
      | "ALL"
      | "PENDING"
      | "CONFIRMED"
      | "COMPLETED"
      | "CANCELLED"
      | "NO_SHOW",
    search: params.search as string | undefined,
  }

  const appointments = await getStaffAppointments(filters)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your scheduled appointments
        </p>
      </div>

      {/* Filters */}
      <StaffAppointmentsFilter filters={filters} />

      {/* Appointments List */}
      <StaffAppointmentsList appointments={appointments?.appointments || []} />
    </div>
  )
}
