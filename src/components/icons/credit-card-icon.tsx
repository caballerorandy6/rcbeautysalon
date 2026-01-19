import { CreditCard } from "@phosphor-icons/react/dist/ssr"

interface CreditCardIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CreditCardIcon({ size = 20, weight = "regular", className = "" }: CreditCardIconProps) {
  return <CreditCard size={size} weight={weight} className={className} />
}
