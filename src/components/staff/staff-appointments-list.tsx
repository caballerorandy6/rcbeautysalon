"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SettingsIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@/components/icons"
import { format } from "date-fns"
import { updateAppointmentStatus } from "@/app/actions/appointments"
import { AppointmentDetailsDialog } from "./appointment-details-dialog"

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
  customer?: {
    name: string
    email: string | null
    phone: string | null
  } | null
  guestEmail?: string | null
  services: AppointmentService[]
}

interface StaffAppointmentsListProps {
  appointments: StaffAppointment[]
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

export function StaffAppointmentsList({
  appointments,
}: StaffAppointmentsListProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedAppointment, setSelectedAppointment] =
    useState<StaffAppointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  // Function to handle marking an appointment as complete
  const handleMarkComplete = async (appointmentId: string) => {
    startTransition(async () => {
      await updateAppointmentStatus(appointmentId, "COMPLETED")
      router.refresh()
    })
  }

  // Function to handle marking an appointment as no show
  const handleMarkNoShow = async (appointmentId: string) => {
    startTransition(async () => {
      await updateAppointmentStatus(appointmentId, "NO_SHOW")
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>
          Showing {appointments.length} appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                const serviceName =
                  appointment.services[0]?.service.name || "Service"
                const totalDuration = appointment.services.reduce(
                  (acc, s) => acc + s.service.duration,
                  0
                )
                const customerEmail =
                  appointment.customer?.email || appointment.guestEmail || ""

                return (
                  <TableRow key={appointment.id}>
                    {/* Customer */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {appointment.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {appointment.customerName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {customerEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell>
                      <p className="font-medium">
                        {format(new Date(appointment.startTime), "MMM d, yyyy")}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {format(new Date(appointment.startTime), "h:mm a")}
                      </p>
                    </TableCell>

                    {/* Service */}
                    <TableCell>
                      {serviceName}
                      {appointment.services.length > 1 && (
                        <span className="text-muted-foreground ml-1 text-xs">
                          +{appointment.services.length - 1}
                        </span>
                      )}
                    </TableCell>

                    {/* Duration */}
                    <TableCell>{totalDuration} min</TableCell>

                    {/* Price */}
                    <TableCell>${appointment.totalPrice.toFixed(2)}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={statusVariants[appointment.status]}>
                        {appointment.status.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                          >
                            <SettingsIcon size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setDialogOpen(true)
                            }}
                          >
                            <EyeIcon size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {(appointment.status === "CONFIRMED" ||
                            appointment.status === "PENDING") && (
                            <>
                              <DropdownMenuItem
                                disabled={isPending}
                                onClick={() =>
                                  handleMarkComplete(appointment.id)
                                }
                              >
                                <CheckCircleIcon size={16} className="mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isPending}
                                className="text-destructive"
                                onClick={() => handleMarkNoShow(appointment.id)}
                              >
                                <XCircleIcon size={16} className="mr-2" />
                                Mark No Show
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMarkComplete={(id) => {
          handleMarkComplete(id)
          setDialogOpen(false)
        }}
        onMarkNoShow={(id) => {
          handleMarkNoShow(id)
          setDialogOpen(false)
          setDialogOpen(false)
        }}
        isPending={isPending}
      />
    </Card>
  )
}
