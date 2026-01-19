import { Storefront } from "@phosphor-icons/react/dist/ssr"

interface StorefrontIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function StorefrontIcon({ size = 20, weight = "regular", className = "" }: StorefrontIconProps) {
  return <Storefront size={size} weight={weight} className={className} />
}
