"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "@/components/icons"
import { AppointmentCard } from "./appointment-card"
import { AppointmentsListProps } from "@/lib/interfaces"

export function AppointmentsList({
  upcomingAppointments,
  pastAppointments,
  newAppointmentId,
}: AppointmentsListProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon
                size={48}
                className="text-muted-foreground mb-4"
                weight="regular"
              />
              <p className="text-muted-foreground mb-4 text-center">
                No upcoming appointments
              </p>
              <Button asChild>
                <Link href="/services">Book Your First Appointment</Link>
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
              <CalendarIcon
                size={48}
                className="text-muted-foreground mb-4"
                weight="regular"
              />
              <p className="text-muted-foreground text-center">
                No past appointments
              </p>
            </CardContent>
          </Card>
        ) : (
          pastAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isPast
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
