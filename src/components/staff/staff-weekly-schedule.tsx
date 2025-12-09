import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon } from "@/components/icons"

interface WorkingHour {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

interface StaffWeeklyScheduleProps {
  workingHours: WorkingHour[]
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function StaffWeeklySchedule({ workingHours }: StaffWeeklyScheduleProps) {
  // Create a complete week schedule (0-6)
  const fullSchedule = dayNames.map((day, index) => {
    const hours = workingHours.find((wh) => wh.dayOfWeek === index)
    return {
      day,
      dayOfWeek: index,
      startTime: hours?.startTime || null,
      endTime: hours?.endTime || null,
      isActive: hours?.isActive ?? false,
    }
  })

  // Reorder to start from Monday
  const scheduleFromMonday = [...fullSchedule.slice(1), fullSchedule[0]]

  const workingDays = scheduleFromMonday.filter((s) => s.isActive).length
  const daysOff = 7 - workingDays

  // Calculate total hours per week
  const totalHours = workingHours
    .filter((wh) => wh.isActive)
    .reduce((acc, wh) => {
      const [startH, startM] = wh.startTime.split(":").map(Number)
      const [endH, endM] = wh.endTime.split(":").map(Number)
      const hours = endH - startH + (endM - startM) / 60
      return acc + hours
    }, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClockIcon size={20} className="text-primary" />
          <CardTitle>Weekly Schedule</CardTitle>
        </div>
        <CardDescription>Your regular working hours</CardDescription>
      </CardHeader>
      <CardContent>
        {workingHours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClockIcon size={40} className="mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">No schedule configured</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Contact admin to set up your working hours
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {scheduleFromMonday.map((schedule) => (
                <div
                  key={schedule.day}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    schedule.isActive ? "bg-muted/30" : "bg-muted/10 opacity-60"
                  }`}
                >
                  <div>
                    <p className="font-medium">{schedule.day}</p>
                    {schedule.isActive && schedule.startTime && schedule.endTime ? (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Day off</p>
                    )}
                  </div>

                  <Badge variant={schedule.isActive ? "default" : "secondary"}>
                    {schedule.isActive ? "Working" : "Off"}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Working Days</p>
                  <p className="text-2xl font-bold">{workingDays}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Hours per Week</p>
                  <p className="text-2xl font-bold">{totalHours}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Days Off</p>
                  <p className="text-2xl font-bold">{daysOff}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
