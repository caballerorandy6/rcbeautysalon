"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon, DesktopIcon } from "@/components/icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const items = [
    { key: "light", label: "Light", icon: SunIcon },
    { key: "dark", label: "Dark", icon: MoonIcon },
    { key: "system", label: "System", icon: DesktopIcon },
  ]

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setOpen(false)
  }

  // Render placeholder button during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="group hover:bg-primary/10">
        <MoonIcon size={20} weight="fill" className="text-primary" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip open={open ? false : undefined}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group hover:bg-primary/10"
            >
              {isDark ? (
                <SunIcon
                  size={20}
                  weight="fill"
                  className="text-accent transition-transform group-hover:scale-110"
                />
              ) : (
                <MoonIcon
                  size={20}
                  weight="fill"
                  className="text-primary transition-transform group-hover:scale-110"
                />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="mt-2 min-w-[140px] space-y-1 bg-card border-border">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = theme === key

          // Light = gold/accent, Dark = rose/primary, System = neutral
          const getStyles = () => {
            if (key === "light") {
              return isActive
                ? "bg-accent/20 text-accent font-semibold shadow-sm"
                : "text-accent/80 hover:text-accent hover:bg-accent/15 hover:shadow-sm"
            }
            if (key === "dark") {
              return isActive
                ? "bg-primary/20 text-primary font-semibold shadow-sm"
                : "text-primary/80 hover:text-primary hover:bg-primary/15 hover:shadow-sm"
            }
            // system
            return isActive
              ? "bg-muted text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }

          const getIconColor = () => {
            if (key === "light") return isActive ? "text-accent" : "text-accent/70"
            if (key === "dark") return isActive ? "text-primary" : "text-primary/70"
            return isActive ? "text-foreground" : "text-muted-foreground"
          }

          return (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-all duration-300 outline-none ${getStyles()}`}
            >
              <Icon size={16} weight="fill" className={`transition-transform duration-300 ${getIconColor()} ${!isActive ? "group-hover:scale-110" : ""}`} />
              {label}
            </button>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
