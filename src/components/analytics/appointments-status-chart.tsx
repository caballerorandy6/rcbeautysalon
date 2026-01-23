"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DonutChart } from "@tremor/react"
import { AppointmentsByStatus } from "@/lib/interfaces"
import { CalendarCheckIcon } from "@/components/icons"

interface AppointmentsStatusChartProps {
  data: AppointmentsByStatus[]
}

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  CONFIRMED: { label: "Confirmed", color: "blue", dotColor: "bg-blue-500" },
  COMPLETED: { label: "Completed", color: "emerald", dotColor: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", color: "red", dotColor: "bg-red-500" },
  NO_SHOW: { label: "No Show", color: "amber", dotColor: "bg-amber-500" },
  PENDING: { label: "Pending", color: "gray", dotColor: "bg-gray-500" },
}

export function AppointmentsStatusChart({ data }: AppointmentsStatusChartProps) {
  const chartData = data.map((item) => ({
    name: statusConfig[item.status]?.label || item.status,
    value: item.count,
    status: item.status,
  }))

  const colors = data.map(
    (item) => statusConfig[item.status]?.color || "gray"
  ) as ("blue" | "emerald" | "red" | "amber" | "gray")[]

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <CalendarCheckIcon size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-base">Appointments Status</CardTitle>
            <CardDescription>Distribution overview</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length > 0 ? (
          <div className="flex flex-col items-center">
            <DonutChart
              className="h-44"
              data={chartData}
              category="value"
              index="name"
              colors={colors}
              showAnimation
              showTooltip
              valueFormatter={(value) => `${value} (${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%)`}
            />
            <div className="mt-6 grid w-full grid-cols-2 gap-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className={`h-2.5 w-2.5 rounded-full ${statusConfig[item.status]?.dotColor || "bg-gray-500"}`} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="ml-auto font-semibold tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">No appointments data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
