"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Desktop } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const items = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Desktop },
  ]

  // Render placeholder button during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="group hover:bg-primary/10">
        <Moon size={20} weight="fill" className="text-primary" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-primary/10"
        >
          {isDark ? (
            <Sun
              size={20}
              weight="fill"
              className="text-accent transition-transform group-hover:scale-110"
            />
          ) : (
            <Moon
              size={20}
              weight="fill"
              className="text-primary transition-transform group-hover:scale-110"
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 min-w-[140px] space-y-1">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = theme === key

          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-all duration-200 outline-none
                ${key === "light"
                  ? `text-accent/90 hover:bg-accent/15 hover:text-accent hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] ${isActive ? "bg-accent/20 text-accent font-medium" : ""}`
                  : key === "dark"
                    ? `text-primary/90 hover:bg-primary/15 hover:text-primary hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] ${isActive ? "bg-primary/20 text-primary font-medium" : ""}`
                    : `text-white/70 hover:bg-white/10 hover:text-white ${isActive ? "bg-white/15 text-white font-medium" : ""}`
                }`}
            >
              <Icon size={16} weight="fill" />
              {label}
            </button>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
