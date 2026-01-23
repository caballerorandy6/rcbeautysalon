"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AreaChart } from "@tremor/react"
import { RevenueDataPoint } from "@/lib/interfaces"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalAppointments = data.reduce((sum, d) => sum + d.appointments, 0)
  const totalProducts = data.reduce((sum, d) => sum + d.products, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Track your income from appointments and product sales
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">
                Appointments: <span className="font-semibold text-foreground">${totalAppointments.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">
                Products: <span className="font-semibold text-foreground">${totalProducts.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="[&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground [&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border">
            <AreaChart
              className="h-72"
              data={data}
              index="date"
              categories={["appointments", "products"]}
              colors={["rose", "amber"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showLegend={false}
              showAnimation
              curveType="monotone"
              showGridLines={true}
              showXAxis={true}
              showYAxis={true}
            />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No revenue data available for this period</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
