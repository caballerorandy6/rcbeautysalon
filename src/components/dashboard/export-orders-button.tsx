"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBagIcon } from "@/components/icons"

interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  customer: {
    name: string | null
    email: string | null
  } | null
  guestName: string | null
  guestEmail: string | null
  _count: {
    items: number
  }
}

interface ExportOrdersButtonProps {
  orders: Order[]
}

export function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
  const handleExport = () => {
    const headers = ["Order ID", "Customer", "Email", "Items", "Total", "Status", "Date"]

    const rows = orders.map((order) => [
      order.id,
      order.customer?.name || order.guestName || "Guest",
      order.customer?.email || order.guestEmail || "-",
      order._count.items.toString(),
      `$${order.total.toFixed(2)}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `orders-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <ShoppingBagIcon size={16} className="mr-2" />
      Export Orders
    </Button>
  )
}
