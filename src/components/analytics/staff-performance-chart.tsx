"use client"

import { Card, Title, Text, BarChart } from "@tremor/react"
import { StaffPerformance } from "@/lib/interfaces"

interface StaffPerformanceChartProps {
  data: StaffPerformance[]
}

export function StaffPerformanceChart({ data }: StaffPerformanceChartProps) {
  const chartData = data.map((staff) => ({
    name: staff.name,
    Appointments: staff.appointments,
    Revenue: staff.revenue,
  }))

  return (
    <Card className="p-4 sm:p-6">
      <Title>Staff Performance</Title>
      <Text className="text-muted-foreground">
        Appointments completed and revenue generated
      </Text>

      {data.length > 0 ? (
        <BarChart
          className="mt-6 h-72"
          data={chartData}
          index="name"
          categories={["Appointments", "Revenue"]}
          colors={["rose", "amber"]}
          yAxisWidth={60}
          showAnimation
          valueFormatter={(value: number) => value.toLocaleString()}
        />
      ) : (
        <div className="mt-8 flex h-72 items-center justify-center">
          <Text className="text-muted-foreground">No data available</Text>
        </div>
      )}
    </Card>
  )
}
