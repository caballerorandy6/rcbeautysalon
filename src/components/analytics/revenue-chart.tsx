"use client"

import { Card, Title, AreaChart, Text } from "@tremor/react"
import { RevenueDataPoint } from "@/lib/interfaces"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Calculate totals for summary
  const totalAppointments = data.reduce((sum, d) => sum + d.appointments, 0)
  const totalProducts = data.reduce((sum, d) => sum + d.products, 0)

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title>Revenue Overview</Title>
          <Text className="text-muted-foreground">
            Appointments vs Product Sales
          </Text>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">
              Appointments: ${totalAppointments.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">
              Products: ${totalProducts.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <AreaChart
        className="mt-6 h-72"
        data={data}
        index="date"
        categories={["appointments", "products"]}
        colors={["rose", "amber"]}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
        showLegend={false}
        showAnimation
        curveType="monotone"
      />
    </Card>
  )
}
