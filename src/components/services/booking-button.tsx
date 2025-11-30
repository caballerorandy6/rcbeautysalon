"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarBlank } from "@phosphor-icons/react"

interface BookingButtonProps {
  href?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "outline" | "secondary"
  className?: string
}

export function BookingButton({
  href = "/booking",
  size = "lg",
  variant = "secondary",
  className = "bg-foreground text-background hover:bg-foreground/90"
}: BookingButtonProps) {
  return (
    <Link href={href}>
      <Button size={size} variant={variant} className={className}>
        <CalendarBlank size={20} weight="regular" className="mr-2" />
        Book Now
      </Button>
    </Link>
  )
}
