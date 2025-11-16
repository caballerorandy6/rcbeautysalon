"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import {
  Calendar,
  ShoppingBag,
  Users,
  Scissors,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Dashboard", href: "", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Booking", href: "/booking", icon: Calendar },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Products", href: "/products", icon: Package },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const params = useParams()
  const pathname = usePathname()
  const tenant = params?.tenant as string

  return (
    <div className="hidden w-64 border-r bg-muted/40 lg:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href={`/${tenant}`} className="flex items-center gap-2 font-semibold">
            <span>Beauty SaaS</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-3">
            {navigation.map((item) => {
              const href = `/${tenant}${item.href}`
              const isActive = pathname === href

              return (
                <Link key={item.name} href={href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
        <Separator />
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            Free Trial - 14 days left
          </p>
        </div>
      </div>
    </div>
  )
}
