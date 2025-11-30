"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 128 }: LogoProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

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
