import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarIcon } from "@/components/icons"

interface CTAButtonProps {
  href: string
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children: React.ReactNode
  variant?: "default" | "outline"
}

export function CTAButton({
  href,
  size = "lg",
  className = "",
  children,
  variant = "default"
}: CTAButtonProps) {
  return (
    <Link href={href}>
      <Button
        size={size}
        variant={variant}
        className={className}
      >
        <CalendarIcon className="group-hover:text-accent mr-2 h-5 w-5 transition-colors" />
        {children}
      </Button>
    </Link>
  )
}
