"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarList } from "@tremor/react"
import { TopService } from "@/lib/interfaces"
import { ScissorsIcon } from "@/components/icons"

interface TopServicesChartProps {
  data: TopService[]
}

export function TopServicesChart({ data }: TopServicesChartProps) {
  const chartData = data.map((service) => ({
    name: service.name,
    value: service.bookings,
  }))

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900/30">
            <ScissorsIcon size={18} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <CardTitle className="text-base">Top Services</CardTitle>
            <CardDescription>By number of bookings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length > 0 ? (
          <div className="space-y-6">
            <BarList
              data={chartData}
              color="rose"
              showAnimation
            />
            <div className="space-y-2 border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</p>
              {data.map((service) => (
                <div key={service.name} className="flex items-center justify-between text-sm">
                  <span className="truncate text-muted-foreground pr-2">
                    {service.name}
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${service.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">No services data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
