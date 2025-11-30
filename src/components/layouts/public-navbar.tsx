"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { List, X } from "@phosphor-icons/react"

interface NavLink {
  href: string
  label: string
  isExternal?: boolean
}

const navLinks: NavLink[] = [
  { href: "/#services", label: "Services", isExternal: true },
  { href: "/shop", label: "Shop" },
  { href: "/#about", label: "About", isExternal: true },
  { href: "/#contact", label: "Contact", isExternal: true },
]

export function PublicNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    // Home page
    if (href === "/") {
      return pathname === "/"
    }

    // Hash links (like /#about, /#contact) - never mark as active
    // Would need scroll detection to know if user is at that section
    if (href.startsWith("/#")) {
      return false
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
          <Logo size={120} className="md:w-40 md:h-40" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-foreground/80 hover:bg-secondary hover:text-primary">
              Login
            </Button>
          </Link>
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
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
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
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-foreground/80 hover:bg-secondary hover:text-primary">
                Login
              </Button>
            </Link>
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
