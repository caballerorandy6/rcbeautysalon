import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        // Primary Rose - darkens on hover for better contrast
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5 active:bg-primary-700 active:translate-y-0 active:shadow-sm dark:hover:bg-primary-400 dark:active:bg-primary-300",

        // Accent Gold
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-600 hover:shadow-md hover:-translate-y-0.5 active:bg-accent-700 active:translate-y-0 active:shadow-sm dark:hover:bg-accent-400 dark:active:bg-accent-300",

        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md dark:bg-destructive/80 dark:hover:bg-destructive/70",

        // Outline - border with hover fill
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-xs dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground",

        // Outline Accent
        "outline-accent":
          "border-2 border-accent bg-transparent text-accent-foreground hover:bg-accent hover:text-accent-foreground shadow-xs dark:border-accent dark:hover:bg-accent",

        // Secondary
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-sm dark:bg-secondary dark:hover:bg-secondary/70",

        // Ghost - minimal, no background
        ghost:
          "text-foreground/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",

        // Ghost Accent
        "ghost-accent":
          "text-foreground/80 hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/20 dark:hover:text-accent",

        // Link
        link: "text-primary underline-offset-4 hover:underline dark:text-primary",

        // Glass - frosted glass effect
        glass:
          "glass text-foreground hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",

        // Glass Primary - tinted glass
        "glass-primary":
          "glass-primary text-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",

        // Glass Accent - gold tinted glass
        "glass-accent":
          "glass-accent text-accent-foreground hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",

        // Success
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md",

        // Warning
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md",

        // Info
        info:
          "bg-info text-info-foreground shadow-sm hover:bg-info/90 hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-6 text-base has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
