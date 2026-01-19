import { CurrencyDollar } from "@phosphor-icons/react/dist/ssr"

interface CurrencyDollarIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function CurrencyDollarIcon({ size = 20, weight = "regular", className = "" }: CurrencyDollarIconProps) {
  return <CurrencyDollar size={size} weight={weight} className={className} />
}
