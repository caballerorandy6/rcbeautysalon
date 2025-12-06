import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  WarningCircleIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  SpinnerGapIcon,
} from "@/components/icons"
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
        <CardHeader className="from-primary/5 to-accent/5 bg-linear-to-br">
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground font-semibold">Service</p>
              <p className="text-base">{service.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground font-semibold">Staff</p>
              <p className="text-base">
                {selectedStaff ? selectedStaff.name : "Not selected"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground font-semibold">Date & Time</p>
              <p className="text-base">
                {selectedDate && selectedTime ? (
                  <>
                    <CalendarIcon
                      size={14}
                      className="mr-1 inline"
                      weight="regular"
                    />
                    {format(selectedDate, "MMM d, yyyy")} at{" "}
                    {selectedSlot?.formattedTime || selectedTime}
                  </>
                ) : (
                  "Not selected"
                )}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground font-semibold">Duration</p>
              <p className="text-base">
                <ClockIcon size={14} className="mr-1 inline" weight="regular" />
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
              <span className="text-primary">
                ${salonConfig.bookingDeposit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Non-refundable warning */}
          <div
            className="rounded-xl border-2 p-4"
            style={{
              backgroundColor: "hsl(0 84% 95%)",
              borderColor: "hsl(0 84% 60%)",
            }}
          >
            <div className="flex gap-3">
              <WarningCircleIcon
                size={32}
                weight="fill"
                className="shrink-0"
                style={{ color: "hsl(0 84% 40%)" }}
              />
              <div className="space-y-1">
                <p
                  className="text-base font-bold"
                  style={{ color: "hsl(0 84% 30%)" }}
                >
                  Non-Refundable Deposit
                </p>
                <p className="text-sm" style={{ color: "hsl(0 84% 35%)" }}>
                  The ${salonConfig.bookingDeposit.toFixed(2)} deposit is
                  required to secure your appointment and is{" "}
                  <strong className="font-bold">non-refundable</strong>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-6">
          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive w-full rounded-lg border-2 p-3 text-sm">
              <WarningCircleIcon
                size={16}
                className="mr-1 inline"
                weight="regular"
              />
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
              <SpinnerGapIcon
                size={20}
                className="animate-spin"
                weight="regular"
              />
            ) : (
              <>
                <CurrencyDollarIcon size={20} className="mr-2" weight="regular" />
                Pay ${salonConfig.bookingDeposit.toFixed(2)} & Confirm Booking
              </>
            )}
          </Button>

          {/* Test Mode Indicator */}
          {process.env.NODE_ENV === "development" && (
            <div className="w-full rounded-lg border border-blue-300 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-950/30">
              <p className="mb-1 font-semibold text-blue-700 dark:text-blue-400">
                Test Mode - No Real Charges
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                Use card: <code className="font-mono font-bold">4242 4242 4242 4242</code>
              </p>
              <p className="text-blue-600 dark:text-blue-300">
                Expiry: Any future date • CVV: Any 3 digits
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
