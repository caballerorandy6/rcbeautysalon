"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  HouseIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from "@/components/icons"

const navItems = [
  {
    label: "Dashboard",
    href: "/staff-portal",
    icon: HouseIcon,
  },
  {
    label: "My Appointments",
    href: "/staff-portal/appointments",
    icon: CalendarIcon,
  },
  {
    label: "My Schedule",
    href: "/staff-portal/schedule",
    icon: ClockIcon,
  },
  {
    label: "My Profile",
    href: "/staff-portal/profile",
    icon: UserIcon,
  },
]

export function StaffSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
