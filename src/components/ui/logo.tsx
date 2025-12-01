"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useSyncExternalStore } from "react"

interface LogoProps {
  className?: string
  size?: number
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

export function Logo({ className, size = 128 }: LogoProps) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={isDark ? "/images/logo/logo-dark.svg" : "/images/logo/logo.svg"}
        alt="Beauty Salon Logo"
        width={size}
        height={size}
        className="object-contain transition-opacity duration-300"
        priority
      />
    </div>
  )
}
