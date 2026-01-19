import { Receipt } from "@phosphor-icons/react/dist/ssr"

interface ReceiptIconProps {
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  className?: string
}

export function ReceiptIcon({ size = 20, weight = "regular", className = "" }: ReceiptIconProps) {
  return <Receipt size={size} weight={weight} className={className} />
}
