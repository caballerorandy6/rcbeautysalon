"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarIcon, ShoppingBagIcon } from "@/components/icons"

export function HeroActions() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Link href="/booking">
        <Button
          size="lg"
          className="from-primary to-primary/90 group w-full bg-linear-to-r text-white shadow-xl hover:opacity-90 sm:w-auto"
        >
          <CalendarIcon className="group-hover:text-accent mr-2 h-5 w-5 transition-colors" />
          Book Appointment
        </Button>
      </Link>
      <Link href="/shop">
        <Button
          size="lg"
          variant="outline"
          className="hover:text-accent hover:border-accent/50 group w-full border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
        >
          <ShoppingBagIcon className="group-hover:text-accent mr-2 h-5 w-5 transition-colors" />
          Shop Products
        </Button>
      </Link>
    </div>
  )
}
