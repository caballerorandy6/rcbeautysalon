"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useSyncExternalStore } from "react"

type LogoVariant = "navbar" | "sidebar" | "footer" | "auth" | "small"

interface LogoProps {
  className?: string
  variant?: LogoVariant
}

// Preset sizes for different contexts
const variantSizes: Record<LogoVariant, { width: number; height: number }> = {
  navbar: { width: 108, height: 36 },
  sidebar: { width: 100, height: 35 },
  footer: { width: 140, height: 50 },
  auth: { width: 160, height: 55 },
  small: { width: 80, height: 28 },
}

// Subscribe to theme changes
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

// Get current theme on client
function getSnapshot() {
  return document.documentElement.classList.contains("dark")
}

// Server snapshot - always return false (light mode) to avoid hydration mismatch
function getServerSnapshot() {
  return false
}

export function Logo({ className, variant = "navbar" }: LogoProps) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { width, height } = variantSizes[variant]

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width, height }}
    >
      <Image
        src={isDark ? "/images/logo/logo-dark.svg" : "/images/logo/logo.svg"}
        alt="RC Beauty Salon"
        width={width}
        height={height}
        className="object-contain transition-opacity duration-300"
        priority
      />
    </div>
  )
}
