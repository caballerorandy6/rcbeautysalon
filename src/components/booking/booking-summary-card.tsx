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
  } | null
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
  isEmployee?: boolean
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
  isEmployee = false,
}: BookingSummaryCardProps) {
  const selectedSlot = availableSlots.find((s) => s.time === selectedTime)

  // Calculate employee discount (20%)
  const employeeDiscountRate = 0.20
  const originalPrice = service?.price || 0
  const discountAmount = isEmployee ? originalPrice * employeeDiscountRate : 0
  const finalPrice = originalPrice - discountAmount

  return (
    <div className="space-y-4">
      <Card className="sticky top-4 border-border/50 shadow-xl">
        <CardHeader className="rounded-t-lg bg-linear-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/15">
          <CardTitle className="text-foreground">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">Service</p>
              <p className="text-base font-medium text-foreground">{service?.name || "Not selected"}</p>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <p className="font-semibold text-muted-foreground">Staff</p>
              <p className="text-base font-medium text-foreground">
                {selectedStaff ? selectedStaff.name : "Not selected"}
              </p>
            </div>
            <Separator className="bg-border/50" />
            <div>
              <p className="font-semibold text-muted-foreground">Date & Time</p>
              <p className="text-base font-medium text-foreground">
                {selectedDate && selectedTime ? (
                  <>
                    <CalendarIcon
                      size={14}
                      className="mr-1 inline text-primary"
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
            <Separator className="bg-border/50" />
            <div>
              <p className="font-semibold text-muted-foreground">Duration</p>
              <p className="text-base font-medium text-foreground">
                <ClockIcon size={14} className="mr-1 inline text-primary" weight="regular" />
                {service?.duration || 0} minutes
              </p>
            </div>
          </div>

          <Separator className="my-4 bg-border/50" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Price</span>
              <span className="font-medium text-foreground">${originalPrice.toFixed(2)}</span>
            </div>
            {isEmployee && (
              <div className="flex justify-between text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span>Employee Discount (20%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            {isEmployee && (
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground">Final Price</span>
                <span className="text-primary">${finalPrice.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2 bg-border/50" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Deposit Required</span>
              {isEmployee ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Not required
                </span>
              ) : (
                <span className="text-primary">
                  ${salonConfig.bookingDeposit.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Non-refundable warning - only show for non-employees */}
          {!isEmployee ? (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40">
              <div className="flex gap-3">
                <WarningCircleIcon
                  size={32}
                  weight="fill"
                  className="shrink-0 text-red-500 dark:text-red-400"
                />
                <div className="space-y-1">
                  <p className="text-base font-bold text-red-700 dark:text-red-300">
                    Non-Refundable Deposit
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    The ${salonConfig.bookingDeposit.toFixed(2)} deposit is
                    required to secure your appointment and is{" "}
                    <strong className="font-bold">non-refundable</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-100 p-4 dark:border-emerald-600 dark:bg-emerald-950/50">
              <div className="flex gap-3">
                <div className="shrink-0 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                    Employee Booking
                  </p>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    No deposit required. Payment will be collected after your
                    appointment is completed.
                  </p>
                </div>
              </div>
            </div>
          )}
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
            ) : isEmployee ? (
              <>
                <CurrencyDollarIcon size={20} className="mr-2" weight="regular" />
                Confirm Employee Booking
              </>
            ) : (
              <>
                <CurrencyDollarIcon size={20} className="mr-2" weight="regular" />
                Pay ${salonConfig.bookingDeposit.toFixed(2)} & Confirm Booking
              </>
            )}
          </Button>

          {/* Test Mode Indicator */}
          {process.env.NODE_ENV === "development" && (
            <div className="w-full rounded-lg border border-border bg-muted/50 p-3 text-xs">
              <p className="mb-1 font-bold text-muted-foreground">
                Test Mode - No Real Charges
              </p>
              <p className="text-muted-foreground">
                Use card: <code className="rounded bg-background px-1.5 py-0.5 font-mono font-bold text-foreground">4242 4242 4242 4242</code>
              </p>
              <p className="text-muted-foreground">
                Expiry: Any future date • CVV: Any 3 digits
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
