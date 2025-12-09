import Image from "next/image"
import { cn } from "@/lib/utils"

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

export function Logo({ className, variant = "navbar" }: LogoProps) {
  const { width, height } = variantSizes[variant]

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width, height }}
    >
      <Image
        src="/images/logo/logo.svg"
        alt="RC Beauty Salon"
        width={width}
        height={height}
        className="h-auto w-auto object-contain dark:brightness-110 dark:contrast-90"
        priority
      />
    </div>
  )
}
