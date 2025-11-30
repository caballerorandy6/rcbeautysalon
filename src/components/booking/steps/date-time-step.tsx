"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SpinnerGap } from "@phosphor-icons/react"
import { format, addDays } from "date-fns"
import { getAvailableTimeSlots } from "@/app/actions/appointments"
import { TimeSlot } from "@/lib/interfaces"

interface DateTimeStepProps {
  selectedStaffId: string
  serviceDuration: number
  selectedDate: Date | undefined
  selectedTime: string
  onSelectDate: (date: Date | undefined) => void
  onSelectTime: (time: string) => void
  maxBookingAdvance: number
  dateError?: string
  timeError?: string
}

export function DateTimeStep({
  selectedStaffId,
  serviceDuration,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  maxBookingAdvance,
  dateError,
  timeError,
}: DateTimeStepProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Load available time slots when staff and date are selected
  useEffect(() => {
    async function loadTimeSlots() {
      if (!selectedStaffId || !selectedDate) return

      setLoadingSlots(true)
      try {
        const slots = await getAvailableTimeSlots(selectedStaffId, selectedDate, serviceDuration)
        setAvailableSlots(slots)
        onSelectTime("") // Reset selected time when slots change
      } catch (err) {
        console.error("Error loading time slots:", err)
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    loadTimeSlots()
  }, [selectedStaffId, selectedDate, serviceDuration, onSelectTime])

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
            3
          </div>
          <CardTitle>Select Date & Time</CardTitle>
        </div>
        <CardDescription>Choose when you'd like to visit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!selectedStaffId ? (
          <p className="text-center text-sm text-muted-foreground">
            Please select a staff member first
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onSelectDate}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const maxDate = addDays(today, maxBookingAdvance)
                    return date < today || date > maxDate
                  }}
                  className="rounded-lg border-2 shadow-sm"
                />
              </div>
              {dateError && <p className="text-center text-sm text-destructive">{dateError}</p>}
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <Label className="block text-base font-semibold">
                  Available Times on {format(selectedDate, "MMMM d, yyyy")}
                </Label>
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <SpinnerGap size={32} className="animate-spin text-primary" weight="regular" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No available time slots for this day
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && onSelectTime(slot.time)}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        className={`${
                          !slot.available ? "opacity-40" : ""
                        } transition-all hover:scale-105`}
                      >
                        {slot.formattedTime}
                      </Button>
                    ))}
                  </div>
                )}
                {timeError && <p className="text-sm text-destructive">{timeError}</p>}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
