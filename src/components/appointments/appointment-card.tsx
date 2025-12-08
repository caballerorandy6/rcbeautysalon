"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
} from "@/components/icons"
import { format, parse } from "date-fns"
import {
  cancelAppointment,
  getAvailableTimeSlots,
  rescheduleAppointment,
} from "@/app/actions/appointments"
import { createDepositCheckoutForAppointment } from "@/app/actions/stripe"
import { AppointmentCardProps, TimeSlot } from "@/lib/interfaces"
import Link from "next/link"
import { RescheduleDialog } from "@/components/appointments/reschedule-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function AppointmentCard({
  appointment,
  isPast = false,
  isNew = false,
}: AppointmentCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Reschedule dialog state
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Cancel confirmation dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const totalDuration = appointment.services.reduce(
    (sum, s) => sum + s.service.duration,
    0
  )

  // Handle date change in reschedule dialog
  const handleDateChange = async (date: Date) => {
    setLoadingSlots(true)
    const slots = await getAvailableTimeSlots(
      appointment.staff.id,
      date,
      totalDuration
    )
    setAvailableSlots(slots)
    setLoadingSlots(false)
  }

  // Handle reschedule submission
  const handleReschedule = (newDate: Date, newTime: string) => {
    startTransition(async () => {
      setError(null)
      const newStartTime = parse(newTime, "HH:mm", newDate)
      const result = await rescheduleAppointment(appointment.id, newStartTime)

      if (result.success) {
        setRescheduleOpen(false)
        router.refresh()
      } else {
        setError(result.error || "Failed to reschedule")
      }
    })
  }

  // Handle pay now
  const handlePayNow = () => {
    startTransition(async () => {
      setError(null)
      const result = await createDepositCheckoutForAppointment(appointment.id)

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setError(result.error || "Failed to initiate payment")
      }
    })
  }

  // Handle cancel appointment
  const handleCancelAppointment = () => {
    startTransition(async () => {
      setError(null)
      const result = await cancelAppointment(appointment.id)

      if (result.success) {
        setCancelDialogOpen(false)
        router.refresh()
      } else {
        setError(result.error || "Failed to cancel appointment")
        setCancelDialogOpen(false)
      }
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline"
        label: string
      }
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

  const serviceNames = appointment.services
    .map((s) => s.service.name)
    .join(", ")

  return (
    <>
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
                <CalendarIcon size={14} weight="regular" />
                {format(new Date(appointment.startTime), "MMMM d, yyyy")} at{" "}
                {format(new Date(appointment.startTime), "h:mm a")}
              </CardDescription>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-muted-foreground flex items-center text-sm">
            <UserIcon size={16} className="mr-2" weight="regular" />
            <span>With {appointment.staff.name}</span>
          </div>
          <div className="text-muted-foreground flex items-center text-sm">
            <ClockIcon size={16} className="mr-2" weight="regular" />
            <span>Duration: {totalDuration} minutes</span>
          </div>
          <div className="text-muted-foreground flex items-center text-sm">
            <CurrencyDollarIcon size={16} className="mr-2" weight="regular" />
            <span>Total Price: ${appointment.totalPrice.toFixed(2)}</span>
          </div>

          {/* Deposit status */}
          {!isPast && (
            <>
              {appointment.depositPaid ? (
                <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon
                      size={20}
                      weight="fill"
                      className="shrink-0 text-green-600 dark:text-green-500"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Deposit Paid: ${appointment.depositAmount.toFixed(2)}
                      </p>
                      <p className="text-green-800 dark:text-green-200">
                        Non-refundable
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border-2 border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2">
                    <WarningCircleIcon
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
            <div className="bg-muted mt-4 rounded-lg p-3">
              <p className="text-sm font-semibold">Notes:</p>
              <p className="text-muted-foreground text-sm">{appointment.notes}</p>
            </div>
          )}
        </CardContent>

        {/* Footer with actions */}
        {!isPast && appointment.status !== "CANCELLED" && (
          <CardFooter className="flex flex-col gap-3">
            {error && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive w-full rounded-lg border-2 p-3 text-sm">
                <WarningCircleIcon
                  size={16}
                  className="mr-1 inline"
                  weight="regular"
                />
                {error}
              </div>
            )}
            <div className="flex w-full gap-2">
              {!appointment.depositPaid && (
                <Button
                  className="flex-1 shadow-lg transition-all hover:scale-105"
                  onClick={handlePayNow}
                  disabled={isPending}
                >
                  {isPending ? (
                    <SpinnerGapIcon
                      size={18}
                      className="animate-spin"
                      weight="regular"
                    />
                  ) : (
                    <>
                      <CurrencyDollarIcon
                        size={18}
                        className="mr-2"
                        weight="regular"
                      />
                      Pay Now
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRescheduleOpen(true)}
                disabled={isPending}
              >
                <CalendarIcon size={18} className="mr-2" weight="regular" />
                Reschedule
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setCancelDialogOpen(true)}
                disabled={isPending}
              >
                {isPending ? (
                  <SpinnerGapIcon
                    size={18}
                    className="animate-spin"
                    weight="regular"
                  />
                ) : (
                  "Cancel"
                )}
              </Button>
            </div>
          </CardFooter>
        )}

        {/* Past appointment actions */}
        {isPast && appointment.status === "COMPLETED" && (
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={`/booking?service=${appointment.services[0]?.service.slug}`}
              >
                Book Again
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Reschedule Dialog */}
      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        currentDate={new Date(appointment.startTime)}
        isPending={isPending}
        onSubmit={handleReschedule}
        availableSlots={availableSlots}
        loadingSlots={loadingSlots}
        onDateChange={handleDateChange}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? The deposit is non-refundable."
        confirmLabel="Yes, Cancel"
        cancelLabel="No, Keep It"
        onConfirm={handleCancelAppointment}
        variant="destructive"
      />
    </>
  )
}
