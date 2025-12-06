"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReceiptIcon, StorefrontIcon } from "@/components/icons"

interface OrdersSummaryProps {
  stats: {
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    totalSpent: number
  } | null
}

export function OrdersSummary({ stats }: OrdersSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ReceiptIcon size={20} className="text-primary" />
          <CardTitle className="text-lg">Orders</CardTitle>
        </div>
        <CardDescription>Your purchase history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-primary text-2xl font-bold">
              {stats?.pendingOrders || 0}
            </p>
            <p className="text-muted-foreground text-xs">Pending</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">
              {stats?.completedOrders || 0}
            </p>
            <p className="text-muted-foreground text-xs">Completed</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-muted/50 mt-4 rounded-lg p-3 text-center">
          <p className="text-muted-foreground text-xs">Total Spent</p>
          <p className="text-primary text-xl font-bold">
            ${stats?.totalSpent?.toFixed(2) || "0.00"}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/my-orders">
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="w-full">
              <StorefrontIcon size={16} className="mr-2" />
              Browse Shop
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
