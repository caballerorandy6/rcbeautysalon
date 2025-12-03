"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@/components/icons/calendar-icon"
import { AppointmentsSummaryProps } from "@/lib/interfaces"

export function AppointmentsSummary({ stats }: AppointmentsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary" />
          <CardTitle className="text-lg">Appointments</CardTitle>
        </div>
        <CardDescription>Your appointment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-primary text-2xl font-bold">
              {stats?.upcomingAppointments || 0}
            </p>
            <p className="text-muted-foreground text-xs">Upcoming</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">
              {stats?.completedAppointments || 0}
            </p>
            <p className="text-muted-foreground text-xs">Completed</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold">
              {stats?.totalAppointments || 0}
            </p>
            <p className="text-muted-foreground text-xs">Total</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/my-appointments">
            <Button variant="outline" className="w-full">
              View All Appointments
            </Button>
          </Link>
          <Link href="/services">
            <Button className="w-full">
              <CalendarIcon size={16} className="mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
