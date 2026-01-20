"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarIcon } from "@/components/icons"

interface BookingButtonProps {
  href?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "secondary"
  className?: string
}

export function BookingButton({
  href = "/booking",
  size = "lg",
  variant = "default",
  className = "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
}: BookingButtonProps) {
  return (
    <Link href={href}>
      <Button size={size} variant={variant} className={className}>
        <CalendarIcon size={20} weight="regular" className="mr-2" />
        Book Now
      </Button>
    </Link>
  )
}
