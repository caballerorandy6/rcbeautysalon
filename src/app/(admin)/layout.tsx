"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  ShoppingBag,
  UserCog,
  Settings,
  Menu,
  Sparkles,
  Bell,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/dashboard/citas", icon: Calendar },
  { name: "Customers", href: "/dashboard/usuarios", icon: Users },
  { name: "Services", href: "/dashboard/servicios", icon: Scissors },
  { name: "Products", href: "/dashboard/productos", icon: Package },
  { name: "Shop Orders", href: "/dashboard/ordenes", icon: ShoppingBag },
  { name: "Staff", href: "/dashboard/staff", icon: UserCog },
  { name: "Settings", href: "/dashboard/configuracion", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/30 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">Beauty Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary font-semibold"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
