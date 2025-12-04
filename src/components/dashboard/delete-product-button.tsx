"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { deleteProduct } from "@/app/actions/products"
import { toast } from "sonner"

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteProduct(productId)

      if (result.success) {
        toast.success("Product deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <SpinnerIcon size={16} className="animate-spin" />
      ) : (
        <TrashIcon size={16} />
      )}
    </Button>
  )
}
