import { ShoppingCart } from "@phosphor-icons/react/dist/ssr"

interface ShoppingCartIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ShoppingCartIcon({ size = 20, weight = "regular", className = "" }: ShoppingCartIconProps) {
  return <ShoppingCart size={size} weight={weight} className={className} />
}
