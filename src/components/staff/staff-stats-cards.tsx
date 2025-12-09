import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@/components/icons"

interface StaffStatsCardsProps {
  stats: {
    todaysAppointments: number
    monthlyAppointments: number
    monthlyEarnings: number
    completedThisMonthAppointments: number
  }
}

export function StaffStatsCards({ stats }: StaffStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Today's Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Today&apos;s Appointments
          </CardTitle>
          <CalendarCheckIcon size={20} className="text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.todaysAppointments}</div>
          <p className="text-muted-foreground text-xs">Scheduled for today</p>
        </CardContent>
      </Card>

      {/* This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            This Month
          </CardTitle>
          <ClockIcon size={20} className="text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.monthlyAppointments}</div>
          <p className="text-muted-foreground text-xs">Total appointments</p>
        </CardContent>
      </Card>

      {/* Monthly Earnings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Monthly Earnings
          </CardTitle>
          <CurrencyDollarIcon size={20} className="text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${stats.monthlyEarnings.toFixed(2)}
          </div>
          <p className="text-muted-foreground text-xs">
            Based on completed services
          </p>
        </CardContent>
      </Card>

      {/* Completed This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Completed
          </CardTitle>
          <CheckCircleIcon size={20} className="text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.completedThisMonthAppointments}
          </div>
          <p className="text-muted-foreground text-xs">This month</p>
        </CardContent>
      </Card>
    </div>
  )
}
