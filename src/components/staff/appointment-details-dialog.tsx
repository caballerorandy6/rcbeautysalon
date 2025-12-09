"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ScissorsIcon,
} from "@/components/icons"
import { format } from "date-fns"

interface AppointmentService {
  service: {
    name: string
    duration: number
    price: number
  }
}

interface StaffAppointment {
  id: string
  startTime: Date
  endTime: Date
  status: string
  customerName: string
  totalPrice: number
  notes?: string | null
  customer?: {
    name: string
    email: string | null
    phone: string | null
  } | null
  guestEmail?: string | null
  guestPhone?: string | null
  services: AppointmentService[]
}

interface AppointmentDetailsDialogProps {
  appointment: StaffAppointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkComplete?: (appointmentId: string) => void
  onMarkNoShow?: (appointmentId: string) => void
  isPending?: boolean
}

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  COMPLETED: "default",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
  onMarkComplete,
  onMarkNoShow,
  isPending = false,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  const customerEmail =
    appointment.customer?.email || appointment.guestEmail || "N/A"
  const customerPhone =
    appointment.customer?.phone || appointment.guestPhone || "N/A"

  const totalDuration = appointment.services.reduce(
    (acc, s) => acc + s.service.duration,
    0
  )

  const canChangeStatus =
    appointment.status === "CONFIRMED" || appointment.status === "PENDING"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-lg gap-0 overflow-hidden p-0 sm:w-full">
        {/* Header with gradient background */}
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <DialogTitle className="text-lg font-bold sm:text-xl">
                Appointment Details
              </DialogTitle>
              <Badge
                variant={statusVariants[appointment.status]}
                className="w-fit text-xs sm:text-sm"
              >
                {statusLabels[appointment.status] || appointment.status}
              </Badge>
            </div>
            <DialogDescription className="text-xs sm:text-sm">
              ID: #{appointment.id.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
          <div className="space-y-5 py-4 sm:space-y-6 sm:py-6">
            {/* Customer Info Card */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider sm:text-sm">
                <span className="bg-primary/10 rounded-full p-1">
                  <ScissorsIcon size={12} className="text-primary" />
                </span>
                Customer
              </h4>
              <div className="bg-card border-border/50 flex items-start gap-3 rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
                <Avatar className="ring-primary/20 h-12 w-12 ring-2 sm:h-14 sm:w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold sm:text-base">
                    {appointment.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {appointment.customerName}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                    <EnvelopeIcon size={14} className="shrink-0" />
                    <span className="truncate">{customerEmail}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                    <PhoneIcon size={14} className="shrink-0" />
                    <span>{customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Date & Time Grid */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold uppercase tracking-wider sm:text-sm">
                <span className="bg-primary/10 rounded-full p-1">
                  <CalendarIcon size={12} className="text-primary" />
                </span>
                Schedule
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-muted/30 border-border/30 rounded-xl border p-3 text-center transition-colors hover:bg-muted/50 sm:p-4">
                  <CalendarIcon
                    size={20}
                    className="text-primary mx-auto mb-2"
                  />
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide sm:text-xs">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    {format(new Date(appointment.startTime), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="bg-muted/30 border-border/30 rounded-xl border p-3 text-center transition-colors hover:bg-muted/50 sm:p-4">
                  <ClockIcon size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide sm:text-xs">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    {format(new Date(appointment.startTime), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Services List */}
            <div className="space-y-3">
              <h4 className="text-muted-foreground flex items-center justify-between text-xs font-semibold uppercase tracking-wider sm:text-sm">
                <span className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full p-1">
                    <ScissorsIcon size={12} className="text-primary" />
                  </span>
                  Services
                </span>
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  {appointment.services.length} item
                  {appointment.services.length > 1 ? "s" : ""}
                </Badge>
              </h4>
              <div className="space-y-2">
                {appointment.services.map((item, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-r from-muted/50 to-muted/30 border-border/30 flex items-center justify-between rounded-xl border p-3 transition-all hover:from-muted/70 hover:to-muted/50 sm:p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium sm:text-base">
                        {item.service.name}
                      </p>
                      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs sm:text-sm">
                        <ClockIcon size={12} />
                        <span>{item.service.duration} min</span>
                      </div>
                    </div>
                    <p className="text-primary ml-3 text-sm font-bold sm:text-base">
                      ${item.service.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Summary Card */}
            <div className="bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Total Duration</span>
                <span className="font-medium">{totalDuration} min</span>
              </div>
              <Separator className="bg-border/30 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm sm:text-base">
                  Total Price
                </span>
                <span className="text-primary text-xl font-bold sm:text-2xl">
                  ${appointment.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            {appointment.notes && (
              <>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider sm:text-sm">
                    Notes
                  </h4>
                  <div className="bg-muted/30 border-border/30 rounded-xl border p-3 sm:p-4">
                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Status Actions */}
            {canChangeStatus && (
              <>
                <Separator className="bg-border/50" />
                <div className="space-y-3">
                  <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider sm:text-sm">
                    Update Status
                  </h4>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      variant="default"
                      className="h-11 flex-1 text-sm shadow-md transition-all hover:shadow-lg sm:h-12 sm:text-base"
                      disabled={isPending}
                      onClick={() => onMarkComplete?.(appointment.id)}
                    >
                      <CheckCircleIcon size={18} className="mr-2" />
                      Mark Complete
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-11 flex-1 text-sm shadow-md transition-all hover:shadow-lg sm:h-12 sm:text-base"
                      disabled={isPending}
                      onClick={() => onMarkNoShow?.(appointment.id)}
                    >
                      <XCircleIcon size={18} className="mr-2" />
                      No Show
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Completed/Cancelled message */}
            {!canChangeStatus && (
              <>
                <Separator className="bg-border/50" />
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    This appointment has been{" "}
                    <span className="font-medium">
                      {statusLabels[appointment.status]?.toLowerCase()}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
