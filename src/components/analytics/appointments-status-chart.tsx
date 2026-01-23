"use client"

import { Card, Title, Text, DonutChart, Legend } from "@tremor/react"
import { AppointmentsByStatus } from "@/lib/interfaces"

interface AppointmentsStatusChartProps {
  data: AppointmentsByStatus[]
}

const statusColors: Record<string, string> = {
  CONFIRMED: "blue",
  COMPLETED: "emerald",
  CANCELLED: "red",
  NO_SHOW: "amber",
  PENDING: "gray",
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
  PENDING: "Pending",
}

export function AppointmentsStatusChart({ data }: AppointmentsStatusChartProps) {
  const chartData = data.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
  }))

  const colors = data.map(
    (item) => statusColors[item.status] || "gray"
  ) as (
    | "blue"
    | "emerald"
    | "red"
    | "amber"
    | "gray"
  )[]

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="h-full p-4 sm:p-6">
      <Title>Appointments by Status</Title>
      <Text className="text-muted-foreground">Distribution overview</Text>

      {data.length > 0 ? (
        <div className="mt-6 flex flex-col items-center">
          <DonutChart
            className="h-52"
            data={chartData}
            category="value"
            index="name"
            colors={colors}
            showAnimation
            valueFormatter={(value) => `${value} (${((value / total) * 100).toFixed(0)}%)`}
          />
          <Legend
            className="mt-6"
            categories={chartData.map((d) => d.name)}
            colors={colors}
          />
        </div>
      ) : (
        <div className="mt-8 flex h-52 items-center justify-center">
          <Text className="text-muted-foreground">No data available</Text>
        </div>
      )}
    </Card>
  )
}
