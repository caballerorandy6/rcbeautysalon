"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import {
  LayoutDashboardIcon,
  CalendarIcon,
  UsersIcon,
  ScissorsIcon,
  PackageIcon,
  ShoppingBagIcon,
  UserCogIcon,
  SettingsIcon,
} from "@/components/icons"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon },
  { name: "Customers", href: "/dashboard/users", icon: UsersIcon },
  { name: "Services", href: "/dashboard/services", icon: ScissorsIcon },
  { name: "Products", href: "/dashboard/products", icon: PackageIcon },
  { name: "Shop Orders", href: "/dashboard/orders", icon: ShoppingBagIcon },
  { name: "Staff", href: "/dashboard/staff", icon: UserCogIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-muted/30 lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-32 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-4">
            <Logo size={160} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary font-semibold"
                  )}
                >
                  <IconComponent size={16} className="mr-3" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
