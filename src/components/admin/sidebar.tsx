"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  ScissorsIcon,
  PackageIcon,
  ShoppingBagIcon,
  UserCogIcon,
  SettingsIcon,
  CloseIcon,
} from "@/components/icons"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon },
  { name: "Customers", href: "/dashboard/users", icon: UsersIcon },
  { name: "Services", href: "/dashboard/services", icon: ScissorsIcon },
  { name: "Products", href: "/dashboard/products", icon: PackageIcon },
  { name: "Shop Orders", href: "/dashboard/orders", icon: ShoppingBagIcon },
  { name: "Staff", href: "/dashboard/staff", icon: UserCogIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-3">
      {navigation.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const IconComponent = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <IconComponent size={18} className={cn(isActive && "text-primary-foreground")} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="sidebar" />
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <SidebarNav />
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-center text-xs text-muted-foreground">
            RC Beauty Salon Admin
          </p>
        </div>
      </div>
    </aside>
  )
}

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="flex h-16 flex-row items-center justify-between border-b px-4">
          <SheetTitle className="flex items-center gap-2">
            <Logo variant="sidebar" />
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <CloseIcon size={18} />
            <span className="sr-only">Close menu</span>
          </Button>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)] py-4">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
