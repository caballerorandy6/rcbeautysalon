"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarBlank,
  Clock,
  CurrencyDollar,
  User,
  WarningCircle,
  CheckCircle,
  SpinnerGap,
} from "@phosphor-icons/react"
import { format } from "date-fns"
import { cancelAppointment } from "@/app/actions/appointments"

interface AppointmentCardProps {
  appointment: {
    id: string
    startTime: Date
    endTime: Date
    status: string
    totalPrice: number
    depositAmount: number
    depositPaid: boolean
    notes: string | null
    staff: {
      name: string
      image: string | null
    }
    services: Array<{
      service: {
        name: string
        duration: number
        imageUrl: string | null
      }
    }>
  }
  isPast?: boolean
  isNew?: boolean
}

export function AppointmentCard({ appointment, isPast = false, isNew = false }: AppointmentCardProps) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancelAppointment = async () => {
    if (!confirm("Are you sure you want to cancel this appointment? The deposit is non-refundable.")) {
      return
    }

    setIsCancelling(true)
    setError(null)

    const result = await cancelAppointment(appointment.id)

    if (result.success) {
      router.refresh() // Reload the page to show updated data
    } else {
      setError(result.error || "Failed to cancel appointment")
      setIsCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      CONFIRMED: { variant: "default", label: "Confirmed" },
      PENDING: { variant: "secondary", label: "Pending Payment" },
      COMPLETED: { variant: "outline", label: "Completed" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "No Show" },
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const serviceNames = appointment.services.map((s) => s.service.name).join(", ")
  const totalDuration = appointment.services.reduce((sum, s) => sum + s.service.duration, 0)

  return (
    <Card
      className={`${isPast ? "opacity-75" : ""} ${isNew ? "border-2 border-green-500 shadow-lg" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {serviceNames}
              {isNew && (
                <Badge variant="default" className="bg-green-600">
                  New
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-1">
              <CalendarBlank size={14} weight="regular" />
              {format(new Date(appointment.startTime), "MMMM d, yyyy")} at{" "}
              {format(new Date(appointment.startTime), "h:mm a")}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <User size={16} className="mr-2" weight="regular" />
          <span>With {appointment.staff.name}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={16} className="mr-2" weight="regular" />
          <span>Duration: {totalDuration} minutes</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CurrencyDollar size={16} className="mr-2" weight="regular" />
          <span>Total Price: ${appointment.totalPrice.toFixed(2)}</span>
        </div>

        {/* Deposit status */}
        {!isPast && (
          <>
            {appointment.depositPaid ? (
              <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/20">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="shrink-0 text-green-600 dark:text-green-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Deposit Paid: ${appointment.depositAmount.toFixed(2)}
                    </p>
                    <p className="text-green-800 dark:text-green-200">Non-refundable</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border-2 border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="flex items-center gap-2">
                  <WarningCircle
                    size={20}
                    weight="fill"
                    className="shrink-0 text-amber-600 dark:text-amber-500"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-900 dark:text-amber-100">
                      Payment Required: ${appointment.depositAmount.toFixed(2)}
                    </p>
                    <p className="text-amber-800 dark:text-amber-200">
                      Please complete payment to confirm your appointment
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Notes */}
        {appointment.notes && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-sm font-semibold">Notes:</p>
            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
          </div>
        )}
      </CardContent>

      {/* Footer with actions */}
      {!isPast && appointment.status !== "CANCELLED" && (
        <CardFooter className="flex flex-col gap-3">
          {error && (
            <div className="w-full rounded-lg border-2 border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <WarningCircle size={16} className="mr-1 inline" weight="regular" />
              {error}
            </div>
          )}
          <div className="flex w-full gap-2">
            {!appointment.depositPaid && (
              <Button className="flex-1 shadow-lg transition-all hover:scale-105">
                <CurrencyDollar size={18} className="mr-2" weight="regular" />
                Pay Now
              </Button>
            )}
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <SpinnerGap size={18} className="mr-2 animate-spin" weight="regular" />
                  Cancelling...
                </>
              ) : (
                "Cancel Appointment"
              )}
            </Button>
          </div>
        </CardFooter>
      )}

      {/* Past appointment actions */}
      {isPast && appointment.status === "COMPLETED" && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            Book Again
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
