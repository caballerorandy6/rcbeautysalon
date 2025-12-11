"use client"

import { ShoppingBagIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"

export function NavCartButton() {
  const itemCount = useCartStore((state) => state.getTotalItems())

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href="/shop">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-11 w-11 hover:bg-primary/10 hover:text-primary"
          >
            <ShoppingBagIcon size={28} weight="regular" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Shop</p>
      </TooltipContent>
    </Tooltip>
  )
}
