"use client"

import * as React from "react"
import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixTooltipProvider delayDuration={300} skipDelayDuration={100}>
      {children}
    </RadixTooltipProvider>
  )
}
