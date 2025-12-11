import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary Rose
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-600",

        // Secondary
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Accent Gold
        accent:
          "border-transparent bg-accent text-accent-foreground shadow-sm hover:bg-accent-600",

        // Destructive
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",

        // Success
        success:
          "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90",

        // Warning
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",

        // Info
        info:
          "border-transparent bg-info text-info-foreground shadow-sm hover:bg-info/90",

        // Outline
        outline:
          "border-2 border-current text-foreground bg-transparent",

        // Outline Primary
        "outline-primary":
          "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",

        // Outline Accent
        "outline-accent":
          "border-2 border-accent text-accent bg-transparent hover:bg-accent/10",

        // Glass - frosted effect
        glass:
          "glass-sm border-0 text-foreground",

        // Glass Primary
        "glass-primary":
          "glass-primary border-0 text-primary",

        // Glass Accent
        "glass-accent":
          "glass-accent border-0 text-accent-foreground",

        // Muted/Subtle
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
