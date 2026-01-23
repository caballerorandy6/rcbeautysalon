"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChart } from "@tremor/react"
import { StaffPerformance } from "@/lib/interfaces"
import { UserCogIcon } from "@/components/icons"

interface StaffPerformanceChartProps {
  data: StaffPerformance[]
}

export function StaffPerformanceChart({ data }: StaffPerformanceChartProps) {
  const chartData = data.map((staff) => ({
    name: staff.name,
    Appointments: staff.appointments,
    Revenue: staff.revenue,
  }))

  const totalAppointments = data.reduce((sum, s) => sum + s.appointments, 0)
  const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <UserCogIcon size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base">Staff Performance</CardTitle>
              <CardDescription>Completed appointments and revenue by staff member</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{totalAppointments} appointments</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">
                Revenue: <span className="font-semibold text-foreground">${totalRevenue.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="[&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground [&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border">
            <BarChart
              className="h-72"
              data={chartData}
              index="name"
              categories={["Appointments", "Revenue"]}
              colors={["rose", "amber"]}
              yAxisWidth={60}
              showAnimation
              showGridLines
              valueFormatter={(value: number) => value.toLocaleString()}
            />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No staff performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
