"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MinusIcon, PlusIcon, TrashIcon, PackageIcon } from "@/components/icons"
import type { CartItem as CartItemType } from "@/store/cart-store"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  const handleConfirmRemove = () => {
    removeItem(item.productId)
    toast.success(`${item.name} has been removed from your cart.`)
    setShowRemoveDialog(false)
  }

  //Decrease Quantity
  const handleDecrease = () => {
    if (item.quantity === 1) {
      setShowRemoveDialog(true)
    } else {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }

  //Increase Quantity
  const handleIncrease = () => updateQuantity(item.productId, item.quantity + 1)

  return (
    <div className="group bg-muted/30 hover:bg-muted/50 flex gap-4 rounded-xl p-4 transition-all">
      {/* Product Image */}
      <div className="border-border/50 bg-background relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border shadow-sm">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-linear-to-br">
            <PackageIcon
              size={36}
              weight="light"
              className="text-muted-foreground/40"
            />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
            {item.name}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            ${item.price.toFixed(2)} each
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1">
          <Button
            onClick={handleDecrease}
            variant="outline"
            size="icon"
            className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 h-9 w-9 rounded-lg"
          >
            <MinusIcon size={16} weight="bold" />
          </Button>
          <span className="w-12 text-center text-lg font-semibold">
            {item.quantity}
          </span>
          <Button
            onClick={handleIncrease}
            variant="outline"
            size="icon"
            className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 h-9 w-9 rounded-lg"
          >
            <PlusIcon size={16} weight="bold" />
          </Button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between py-1">
        <div className="text-right">
          <p className="text-foreground text-lg font-bold">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          {item.quantity > 1 && (
            <p className="text-muted-foreground text-xs">
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          )}
        </div>
        <Button
          onClick={() => setShowRemoveDialog(true)}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-9 w-9 rounded-lg"
        >
          <TrashIcon size={18} />
        </Button>
      </div>

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        title="Remove Item"
        description={`Are you sure you want to remove "${item.name}" from your cart?`}
        confirmLabel="Remove"
        onConfirm={handleConfirmRemove}
        variant="destructive"
      />
    </div>
  )
}
