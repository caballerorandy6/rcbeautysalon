"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SpinnerIcon } from "@/components/icons"
import { updateAppointmentStatus } from "@/app/actions/appointments"
import { AppointmentStatus } from "@/lib/types"
import { StatusActionsProps } from "@/lib/interfaces"
import { toast } from "sonner"

const statusTransitions: Record<
  AppointmentStatus,
  { label: string; status: AppointmentStatus; variant?: "default" | "destructive" | "outline" }[]
> = {
  PENDING: [
    { label: "Confirm", status: "CONFIRMED" },
    { label: "Cancel", status: "CANCELLED", variant: "destructive" },
  ],
  CONFIRMED: [
    { label: "Mark Complete", status: "COMPLETED" },
    { label: "No Show", status: "NO_SHOW", variant: "outline" },
    { label: "Cancel", status: "CANCELLED", variant: "destructive" },
  ],
  COMPLETED: [],
  CANCELLED: [
    { label: "Reopen as Pending", status: "PENDING", variant: "outline" },
  ],
  NO_SHOW: [
    { label: "Reopen as Pending", status: "PENDING", variant: "outline" },
  ],
}

export function AppointmentStatusActions({
  appointmentId,
  currentStatus,
}: StatusActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  const actions = statusTransitions[currentStatus] || []

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    setPendingStatus(newStatus)
    startTransition(async () => {
      try {
        await updateAppointmentStatus(appointmentId, newStatus)
        toast.success(`Status updated to ${newStatus.replace("_", " ")}`)
        router.refresh()
      } catch (error) {
        console.error("Failed to update status:", error)
        toast.error("Failed to update status")
      } finally {
        setPendingStatus(null)
      }
    })
  }

  if (actions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No actions available for this status
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.status}
          variant={action.variant || "outline"}
          size="sm"
          disabled={isPending}
          onClick={() => handleStatusChange(action.status)}
        >
          {pendingStatus === action.status ? (
            <SpinnerIcon size={16} className="animate-spin" />
          ) : (
            action.label
          )}
        </Button>
      ))}
    </div>
  )
}
