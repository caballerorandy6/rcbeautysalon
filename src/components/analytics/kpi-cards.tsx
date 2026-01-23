"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CurrencyDollarIcon,
  CalendarCheckIcon,
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
} from "@/components/icons"
import { KPIData } from "@/lib/interfaces"
import { cn } from "@/lib/utils"

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      metric: `$${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: data.revenueChange,
      icon: CurrencyDollarIcon,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Appointments",
      metric: data.totalAppointments.toLocaleString(),
      change: data.appointmentsChange,
      icon: CalendarCheckIcon,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Product Orders",
      metric: data.totalOrders.toLocaleString(),
      change: data.ordersChange,
      icon: ShoppingBagIcon,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Customers",
      metric: data.totalCustomers.toLocaleString(),
      change: data.customersChange,
      icon: UsersIcon,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("rounded-lg p-2", card.bgColor)}>
              <card.icon size={20} className={card.color} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{card.metric}</div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendingUpIcon
                size={14}
                className={cn(
                  card.change > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : card.change < 0
                      ? "text-red-600 dark:text-red-400 rotate-180"
                      : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  card.change > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : card.change < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                )}
              >
                {card.change > 0 ? "+" : ""}
                {card.change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
