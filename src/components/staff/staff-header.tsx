"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"
import {
  MenuIcon,
  UserIcon,
  LogoutIcon,
  HouseIcon,
  CalendarIcon,
  ClockIcon,
  CloseIcon,
} from "@/components/icons"

interface StaffHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const mobileNavItems = [
  { label: "Dashboard", href: "/staff-portal", icon: HouseIcon },
  { label: "My Appointments", href: "/staff-portal/appointments", icon: CalendarIcon },
  { label: "My Schedule", href: "/staff-portal/schedule", icon: ClockIcon },
  { label: "My Profile", href: "/staff-portal/profile", icon: UserIcon },
]

export function StaffHeader({ user }: StaffHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "S"

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon size={24} />
            </Button>

            {/* Logo */}
            <Link href="/staff-portal">
              <Logo variant="small" />
            </Link>

            {/* Portal Label */}
            <span className="hidden rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary sm:inline-block">
              Staff Portal
            </span>
          </div>

          {/* Right: User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || undefined} alt={user.name || "Staff"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/staff-portal/profile" className="cursor-pointer">
                  <UserIcon size={16} className="mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout" className="cursor-pointer text-destructive">
                  <LogoutIcon size={16} className="mr-2" />
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <Logo variant="small" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CloseIcon size={20} />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {mobileNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
