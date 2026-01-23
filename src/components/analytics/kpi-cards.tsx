"use client"

import { Card, Metric, Text, Flex, BadgeDelta } from "@tremor/react"
import {
  CurrencyDollarIcon,
  CalendarCheckIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@/components/icons"
import { KPIData } from "@/lib/interfaces"

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      metric: `$${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: data.revenueChange,
      icon: CurrencyDollarIcon,
    },
    {
      title: "Appointments",
      metric: data.totalAppointments.toLocaleString(),
      change: data.appointmentsChange,
      icon: CalendarCheckIcon,
    },
    {
      title: "Product Orders",
      metric: data.totalOrders.toLocaleString(),
      change: data.ordersChange,
      icon: ShoppingBagIcon,
    },
    {
      title: "Customers",
      metric: data.totalCustomers.toLocaleString(),
      change: data.customersChange,
      icon: UsersIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-4">
          <Flex alignItems="start" justifyContent="between">
            <div className="truncate">
              <Text className="text-muted-foreground">{card.title}</Text>
              <Metric className="mt-1 text-2xl font-bold">{card.metric}</Metric>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <card.icon size={24} className="text-primary" />
            </div>
          </Flex>
          <Flex className="mt-4" justifyContent="start" alignItems="center">
            <BadgeDelta
              deltaType={
                card.change > 0
                  ? "increase"
                  : card.change < 0
                    ? "decrease"
                    : "unchanged"
              }
              size="sm"
            >
              {card.change > 0 ? "+" : ""}
              {card.change.toFixed(1)}%
            </BadgeDelta>
            <Text className="ml-2 text-sm text-muted-foreground">
              vs previous period
            </Text>
          </Flex>
        </Card>
      ))}
    </div>
  )
}
