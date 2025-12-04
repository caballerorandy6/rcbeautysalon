"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { deleteStaffMember } from "@/app/actions/staff"
import { toast } from "sonner"

interface DeleteStaffButtonProps {
  staffId: string
  staffName: string
}

export function DeleteStaffButton({ staffId, staffName }: DeleteStaffButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${staffName}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteStaffMember(staffId)

      if (result.success) {
        toast.success("Staff member deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete staff member")
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
