"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarBlank } from "@phosphor-icons/react"
import { AppointmentCard } from "./appointment-card"

interface AppointmentData {
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

interface AppointmentsListProps {
  upcomingAppointments: AppointmentData[]
  pastAppointments: AppointmentData[]
  newAppointmentId?: string
}

export function AppointmentsList({
  upcomingAppointments,
  pastAppointments,
  newAppointmentId,
}: AppointmentsListProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
        <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarBlank size={48} className="mb-4 text-muted-foreground" weight="regular" />
              <p className="mb-4 text-center text-muted-foreground">No upcoming appointments</p>
              <Button asChild>
                <a href="/services">Book Your First Appointment</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          upcomingAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isNew={appointment.id === newAppointmentId}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {pastAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarBlank size={48} className="mb-4 text-muted-foreground" weight="regular" />
              <p className="text-center text-muted-foreground">No past appointments</p>
            </CardContent>
          </Card>
        ) : (
          pastAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} isPast />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
