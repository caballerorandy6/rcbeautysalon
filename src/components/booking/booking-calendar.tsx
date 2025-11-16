"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BookingCalendar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" className="rounded-md border" />
      </CardContent>
    </Card>
  )
}
