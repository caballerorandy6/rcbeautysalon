import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  WarningCircle,
  CalendarBlank,
  Clock,
  CurrencyDollar,
  SpinnerGap,
} from "@phosphor-icons/react/dist/ssr"
import { format } from "date-fns"
import { AvailableStaffMember, TimeSlot } from "@/lib/interfaces"

interface BookingSummaryCardProps {
  service: {
    name: string
    price: number
    duration: number
  }
  selectedStaff?: AvailableStaffMember
  selectedDate?: Date
  selectedTime?: string
  salonConfig: {
    bookingDeposit: number
    depositRefundable: boolean
  }
  submitting: boolean
  error: string | null
  availableSlots: TimeSlot[]
}

export function BookingSummaryCard({
  service,
  selectedStaff,
  selectedDate,
  selectedTime,
  salonConfig,
  submitting,
  error,
  availableSlots,
}: BookingSummaryCardProps) {
  const selectedSlot = availableSlots.find((s) => s.time === selectedTime)

  return (
    <div className="space-y-4">
      <Card className="sticky top-4 shadow-xl">
        <CardHeader className="bg-linear-to-br from-primary/5 to-accent/5">
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">Service</p>
              <p className="text-base">{service.name}</p>
            </div>
            <Separator />
            <div>
              <p className="font-semibold text-muted-foreground">Staff</p>
              <p className="text-base">
                {selectedStaff ? selectedStaff.name : "Not selected"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="font-semibold text-muted-foreground">Date & Time</p>
              <p className="text-base">
                {selectedDate && selectedTime ? (
                  <>
                    <CalendarBlank size={14} className="mr-1 inline" weight="regular" />
                    {format(selectedDate, "MMM d, yyyy")} at {selectedSlot?.formattedTime || selectedTime}
                  </>
                ) : (
                  "Not selected"
                )}
              </p>
            </div>
            <Separator />
            <div>
              <p className="font-semibold text-muted-foreground">Duration</p>
              <p className="text-base">
                <Clock size={14} className="mr-1 inline" weight="regular" />
                {service.duration} minutes
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Service Price</span>
              <span>${service.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Deposit Required</span>
              <span className="text-primary">${salonConfig.bookingDeposit.toFixed(2)}</span>
            </div>
          </div>

          {/* Non-refundable warning */}
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex gap-2">
              <WarningCircle
                size={20}
                weight="fill"
                className="shrink-0 text-amber-600 dark:text-amber-500"
              />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Non-Refundable Deposit
                </p>
                <p className="text-amber-800 dark:text-amber-200">
                  The ${salonConfig.bookingDeposit.toFixed(2)} deposit is required to secure your
                  appointment and is <strong>non-refundable</strong>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-6">
          {error && (
            <div className="w-full rounded-lg border-2 border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <WarningCircle size={16} className="mr-1 inline" weight="regular" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full text-base shadow-lg transition-all hover:scale-105"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <SpinnerGap size={20} className="mr-2 animate-spin" weight="regular" />
                Processing...
              </>
            ) : (
              <>
                <CurrencyDollar size={20} className="mr-2" weight="regular" />
                Pay ${salonConfig.bookingDeposit.toFixed(2)} & Confirm Booking
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
