"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, SpinnerGapIcon } from "@/components/icons"
import { format } from "date-fns"
import { TimeSlot } from "@/lib/interfaces"

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDate: Date
  isPending: boolean
  onSubmit: (newDate: Date, newTime: string) => void
  availableSlots: TimeSlot[]
  loadingSlots: boolean
  onDateChange: (date: Date) => void
}

export function RescheduleDialog({
  open,
  onOpenChange,
  currentDate,
  isPending,
  onSubmit,
  availableSlots,
  loadingSlots,
  onDateChange,
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime("") // Reset time when date changes
    if (date) {
      onDateChange(date)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when dialog closes
      setSelectedDate(undefined)
      setSelectedTime("")
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onSubmit(selectedDate, selectedTime)
    }
  }

  const availableTimeSlots = availableSlots.filter((slot) => slot.available)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-primary" />
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription>
            Select a new date and time for your appointment. Current:{" "}
            {format(currentDate, "PPP 'at' p")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select New Date</Label>
            <div className="flex justify-center rounded-lg border p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <ClockIcon size={16} />
              Select New Time
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              disabled={!selectedDate || loadingSlots}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedDate
                      ? "Select a date first"
                      : loadingSlots
                        ? "Loading times..."
                        : "Select a time"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.length === 0 && !loadingSlots ? (
                  <SelectItem value="no-slots" disabled>
                    No available times for this date
                  </SelectItem>
                ) : (
                  availableTimeSlots.map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      {slot.formattedTime}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedDate && availableTimeSlots.length > 0 && !loadingSlots && (
              <p className="text-muted-foreground text-xs">
                {availableTimeSlots.length} time slots available
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || isPending}
          >
            {isPending && (
              <SpinnerGapIcon size={16} className="mr-2 animate-spin" />
            )}
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
