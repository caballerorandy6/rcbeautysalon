import type { Metadata } from "next"
import { StaffWeeklySchedule } from "@/components/staff/staff-weekly-schedule"
import { StaffTimeOffRequests } from "@/components/staff/staff-time-off-requests"

export const metadata: Metadata = {
  title: "My Schedule | Staff Portal",
  description: "View and manage your working hours",
}

export default function StaffSchedulePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground mt-1">
          View your working hours and request time off
        </p>
      </div>

      {/* Weekly Schedule */}
      <StaffWeeklySchedule />

      {/* Time Off Requests */}
      <StaffTimeOffRequests />
    </div>
  )
}
