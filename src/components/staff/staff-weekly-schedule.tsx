"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PencilIcon } from "@/components/icons"

// Mock data
const mockSchedule = [
  { day: "Monday", dayOfWeek: 1, startTime: "9:00 AM", endTime: "6:00 PM", isActive: true },
  { day: "Tuesday", dayOfWeek: 2, startTime: "9:00 AM", endTime: "6:00 PM", isActive: true },
  { day: "Wednesday", dayOfWeek: 3, startTime: "9:00 AM", endTime: "6:00 PM", isActive: true },
  { day: "Thursday", dayOfWeek: 4, startTime: "9:00 AM", endTime: "6:00 PM", isActive: true },
  { day: "Friday", dayOfWeek: 5, startTime: "9:00 AM", endTime: "6:00 PM", isActive: true },
  { day: "Saturday", dayOfWeek: 6, startTime: null, endTime: null, isActive: false },
  { day: "Sunday", dayOfWeek: 0, startTime: null, endTime: null, isActive: false },
]

export function StaffWeeklySchedule() {
  // TODO: Fetch real schedule from server action

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your regular working hours</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <PencilIcon size={16} className="mr-2" />
          Edit Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSchedule.map((schedule) => (
            <div
              key={schedule.day}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Switch checked={schedule.isActive} disabled />
                <div>
                  <p className="font-medium">{schedule.day}</p>
                  {schedule.isActive ? (
                    <p className="text-sm text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Day off</p>
                  )}
                </div>
              </div>

              <Badge variant={schedule.isActive ? "default" : "secondary"}>
                {schedule.isActive ? "Working" : "Off"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Working Days</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours per Week</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Off</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
