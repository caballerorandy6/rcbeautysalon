import type { Metadata } from "next"
import { StaffStatsCards } from "@/components/staff/staff-stats-cards"
import { StaffTodayAppointments } from "@/components/staff/staff-today-appointments"
import { StaffQuickActions } from "@/components/staff/staff-quick-actions"
import {
  getStaffPortalStats,
  getStaffTodaysAppointments,
} from "@/app/actions/staff"

export const metadata: Metadata = {
  title: "Staff Portal | RC Beauty Salon",
  description: "Manage your appointments and schedule",
}

export default async function StaffDashboardPage() {
  const [stats, appointments] = await Promise.all([
    getStaffPortalStats(),
    getStaffTodaysAppointments(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <StaffStatsCards
        stats={
          stats?.stats || {
            todaysAppointments: 0,
            completedThisMonthAppointments: 0,
            monthlyEarnings: 0,
            monthlyAppointments: 0,
           
          }
        }
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Appointments - Takes 2 columns */}
        <div className="lg:col-span-2">
          <StaffTodayAppointments
            appointments={appointments?.appointments || []}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <StaffQuickActions />
        </div>
      </div>
    </div>
  )
}
