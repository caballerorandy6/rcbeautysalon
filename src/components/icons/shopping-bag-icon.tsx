import { ShoppingBag } from "@phosphor-icons/react/dist/ssr"

interface ShoppingBagIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ShoppingBagIcon({ size = 20, weight = "regular", className = "" }: ShoppingBagIconProps) {
  return <ShoppingBag size={size} weight={weight} className={className} />
}
