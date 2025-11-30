"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine icon based on resolved theme
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group transition-colors hover:bg-primary/10"
        >
          {mounted ? (
            isDark ? (
              <Sun
                size={20}
                weight="fill"
                className="text-accent transition-transform duration-200 group-hover:scale-110"
              />
            ) : (
              <Moon
                size={20}
                weight="fill"
                className="text-primary transition-transform duration-200 group-hover:scale-110"
              />
            )
          ) : (
            <Moon
              size={20}
              weight="fill"
              className="text-primary transition-transform duration-200 group-hover:scale-110"
            />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`
            cursor-pointer transition-all duration-200
            hover:bg-accent/10 hover:!text-accent!
            focus:bg-accent/10 focus:!text-accent!
            ${mounted && theme === "light"
              ? "bg-accent/15 text-accent font-semibold"
              : "text-accent/80"
            }
          `}
        >
          <Sun size={16} weight="fill" className="mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`
            cursor-pointer transition-all duration-200
            hover:bg-primary/10 hover:text-primary
            focus:bg-primary/10 focus:text-primary
            ${mounted && theme === "dark"
              ? "bg-primary/15 text-primary font-semibold"
              : "text-primary/80"
            }
          `}
        >
          <Moon size={16} weight="fill" className="mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`
            cursor-pointer transition-all duration-200
            hover:bg-white/10 hover:text-white
            focus:bg-white/10 focus:text-white
            ${mounted && theme === "system"
              ? "bg-white/15 text-white font-semibold"
              : "text-white/80"
            }
          `}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
