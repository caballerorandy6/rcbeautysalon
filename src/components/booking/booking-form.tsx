"use client"
/* eslint-disable react-hooks/incompatible-library */

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  bookingSchema,
  authenticatedBookingSchema,
} from "@/lib/validations/booking"
import { createCheckoutSession } from "@/app/actions/stripe"
//import { AvailableStaffMember } from "@/lib/interfaces"
import { ServiceStep } from "./steps/service-step"
import { StaffStep } from "./steps/staff-step"
import { DateTimeStep } from "./steps/date-time-step"
import { CustomerInfoStep } from "./steps/customer-info-step"
import { BookingSummaryCard } from "./booking-summary-card"

import { BookingFormProps, BookingFormValues } from "@/lib/interfaces"

export function BookingForm({
  service,
  availableStaff,
  salonConfig,
  isAuthenticated,
  defaultValues = {},
}: BookingFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use appropriate schema based on authentication status
  const schema = isAuthenticated ? authenticatedBookingSchema : bookingSchema

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema) as never,
    mode: "onChange",
    defaultValues: {
      staffId: "",
      date: undefined,
      time: "",
      firstName: defaultValues.firstName || "",
      lastName: defaultValues.lastName || "",
      email: defaultValues.email || "",
      phone: "",
      notes: "",
    },
  })

  const staffId = watch("staffId")
  const selectedDate = watch("date")
  const selectedTime = watch("time")

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitting(true)
    setError(null)

    try {
      if (!data.date) {
        setError("Please select a date")
        setSubmitting(false)
        return
      }

      // Combine date and time into a single datetime
      const [hours, minutes] = data.time.split(":").map(Number)
      const startTime = new Date(data.date)
      startTime.setHours(hours, minutes, 0, 0)

      // Create Stripe Checkout session and redirect to payment
      const result = await createCheckoutSession({
        serviceIds: [service.id],
        staffId: data.staffId,
        startTime: startTime.toISOString(),
        guestName: !isAuthenticated
          ? `${data.firstName} ${data.lastName}`
          : undefined,
        guestEmail: !isAuthenticated ? data.email : undefined,
        guestPhone: data.phone || undefined,
        notes: data.notes || undefined,
      })

      if (result.success && result.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.checkoutUrl
      } else {
        setError(result.error || "Failed to create payment session")
        setSubmitting(false)
      }
    } catch (err) {
      console.error("Error creating checkout session:", err)
      setError("An unexpected error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Form Steps */}
        <div className="space-y-6 lg:col-span-2">
          {/* Step 1: Service Display (Read-only) */}
          <ServiceStep service={service} />

          {/* Step 2: Staff Selection */}
          <StaffStep
            availableStaff={availableStaff}
            selectedStaffId={staffId}
            onSelectStaff={(id) =>
              setValue("staffId", id, { shouldValidate: true })
            }
            error={errors.staffId?.message}
          />

          {/* Step 3: Date & Time Selection */}
          <DateTimeStep
            selectedStaffId={staffId}
            serviceDuration={service.duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(date) =>
              setValue("date", date, { shouldValidate: true })
            }
            onSelectTime={(time) =>
              setValue("time", time, { shouldValidate: true })
            }
            maxBookingAdvance={salonConfig.maxBookingAdvance}
            dateError={errors.date?.message}
            timeError={errors.time?.message}
          />

          {/* Step 4: Customer Information */}
          <CustomerInfoStep
            register={register}
            errors={errors}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Right Column - Summary & Submit */}
        <div className="lg:col-span-1">
          <BookingSummaryCard
            service={service}
            selectedStaff={availableStaff.find((s) => s.id === staffId)}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            salonConfig={salonConfig}
            submitting={submitting}
            error={error}
            availableSlots={[]} // We'll pass this from DateTimeStep if needed
          />
        </div>
      </div>
    </form>
  )
}
