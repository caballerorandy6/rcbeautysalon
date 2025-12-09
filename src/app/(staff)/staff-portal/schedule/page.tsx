import type { Metadata } from "next"
import { getStaffWorkingHours } from "@/app/actions/staff"
import { StaffWeeklySchedule } from "@/components/staff/staff-weekly-schedule"

export const metadata: Metadata = {
  title: "My Schedule | Staff Portal",
  description: "View your working hours",
}

export default async function StaffSchedulePage() {
  const result = await getStaffWorkingHours()
  const workingHours = result.success ? result.workingHours ?? [] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground mt-1">
          View your working hours
        </p>
      </div>

      {/* Weekly Schedule */}
      <StaffWeeklySchedule workingHours={workingHours} />
    </div>
  )
}
