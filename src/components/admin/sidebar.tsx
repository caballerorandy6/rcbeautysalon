"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard">
            <Logo size={140} />
          </Link>
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <IconComponent size={18} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            Admin Panel v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}
