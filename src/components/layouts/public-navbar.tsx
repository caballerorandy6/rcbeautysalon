"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { List, X, User, SignOut, CalendarCheck, Gear } from "@phosphor-icons/react"
import { useNavigationStore } from "@/store/navigation-store"

interface NavLink {
  href: string
  label: string
  isExternal?: boolean
}

const navLinks: NavLink[] = [
  { href: "/#services", label: "Services", isExternal: true },
  { href: "/#team", label: "Our Team", isExternal: true },
  { href: "/#shop", label: "Shop", isExternal: true },
  { href: "/#about", label: "About", isExternal: true },
  { href: "/#contact", label: "Contact", isExternal: true },
]

export function PublicNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { activeSection } = useNavigationStore()

  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!session?.user) return "/login"
    const role = session.user.role
    if (role === "ADMIN") return "/dashboard"
    if (role === "STAFF") return "/staff-portal"
    return "/my-appointments"
  }

  const isActive = (href: string) => {
    // Home page
    if (href === "/") {
      return pathname === "/"
    }

    // Hash links (like /#about, /#contact) - check active section from scroll
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "")
      return pathname === "/" && activeSection === sectionId
    }

    // Regular routes like /services, /shop
    // Match exact path or any subpath (e.g., /services/haircut)
    if (pathname === href) return true
    if (pathname?.startsWith(href + "/")) return true

    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo size={140} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${
                isActive(link.href)
                  ? "text-primary-foreground bg-primary shadow-sm"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {isLoading ? (
            <Button variant="ghost" disabled className="w-20">
              <span className="animate-pulse">...</span>
            </Button>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:bg-secondary hover:text-primary gap-2">
                  <User size={18} />
                  <span className="max-w-24 truncate">{session.user.name || "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                    <Gear size={16} />
                    {session.user.role === "ADMIN" ? "Dashboard" : session.user.role === "STAFF" ? "Staff Portal" : "My Appointments"}
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "CLIENTE" && (
                  <DropdownMenuItem asChild>
                    <Link href="/my-appointments" className="flex items-center gap-2 cursor-pointer">
                      <CalendarCheck size={16} />
                      My Appointments
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <SignOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-foreground/80 hover:bg-secondary hover:text-primary">
                Login
              </Button>
            </Link>
          )}
          <Link href="/booking">
            <Button className="from-primary to-primary/90 bg-linear-to-r text-white hover:opacity-90 shadow-md group">
              <span className="group-hover:text-accent transition-colors">Book Now</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="text-foreground/70 hover:text-primary transition-colors md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} weight="bold" />
          ) : (
            <List size={24} weight="bold" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-card/95 backdrop-blur-md md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${
                  isActive(link.href)
                    ? "text-primary-foreground bg-primary shadow-sm"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-4 border-t border-border/50">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Theme</span>
            </div>
            {isLoading ? (
              <Button variant="ghost" disabled className="w-full">
                <span className="animate-pulse">Loading...</span>
              </Button>
            ) : isAuthenticated ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-foreground/80 hover:bg-secondary hover:text-primary gap-2">
                    <User size={18} />
                    {session.user.name || "Account"}
                  </Button>
                </Link>
                {session.user.role === "CLIENTE" && (
                  <Link href="/my-appointments" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-foreground/80 hover:bg-secondary hover:text-primary gap-2">
                      <CalendarCheck size={18} />
                      My Appointments
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:bg-destructive/10 gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  <SignOut size={18} />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-foreground/80 hover:bg-secondary hover:text-primary">
                  Login
                </Button>
              </Link>
            )}
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
              <Button className="from-primary to-primary/90 bg-linear-to-r text-white hover:opacity-90 w-full">
                Book Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
