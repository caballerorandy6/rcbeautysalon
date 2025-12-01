"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { updateAppointmentStatus } from "@/app/actions/appointments"
import { AppointmentStatus } from "@/lib/types"

interface StatusActionsProps {
  appointmentId: string
  currentStatus: AppointmentStatus
}

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
  const [loading, setLoading] = useState<string | null>(null)

  const actions = statusTransitions[currentStatus] || []

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setLoading(newStatus)
    try {
      await updateAppointmentStatus(appointmentId, newStatus)
      router.refresh()
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(null)
    }
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
          disabled={loading !== null}
          onClick={() => handleStatusChange(action.status)}
        >
          {loading === action.status ? "Updating..." : action.label}
        </Button>
      ))}
    </div>
  )
}
