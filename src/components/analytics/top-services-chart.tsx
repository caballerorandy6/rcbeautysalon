"use client"

import { Card, Title, Text, BarList, Flex } from "@tremor/react"
import { TopService } from "@/lib/interfaces"

interface TopServicesChartProps {
  data: TopService[]
}

export function TopServicesChart({ data }: TopServicesChartProps) {
  const chartData = data.map((service) => ({
    name: service.name,
    value: service.bookings,
    revenue: service.revenue,
  }))

  return (
    <Card className="h-full p-4 sm:p-6">
      <Title>Top Services</Title>
      <Text className="text-muted-foreground">By number of bookings</Text>

      {data.length > 0 ? (
        <>
          <Flex className="mt-6 border-b border-border pb-2">
            <Text className="font-medium">Service</Text>
            <Text className="font-medium">Bookings</Text>
          </Flex>
          <BarList
            data={chartData}
            className="mt-4"
            color="rose"
            showAnimation
          />
          <div className="mt-6 space-y-2">
            {data.map((service) => (
              <Flex key={service.name} justifyContent="between">
                <Text className="truncate text-sm text-muted-foreground">
                  {service.name}
                </Text>
                <Text className="text-sm font-medium">
                  ${service.revenue.toLocaleString()}
                </Text>
              </Flex>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 flex h-32 items-center justify-center">
          <Text className="text-muted-foreground">No data available</Text>
        </div>
      )}
    </Card>
  )
}
