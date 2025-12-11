"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  bookingSchema,
  authenticatedBookingSchema,
} from "@/lib/validations/booking"
import { createCheckoutSession } from "@/app/actions/stripe"
import { createAppointment } from "@/app/actions/appointments"
import { ServiceStep } from "./steps/service-step"
import { ServiceSelectionStep } from "./steps/service-selection-step"
import { StaffStep } from "./steps/staff-step"
import { StaffDisplayStep } from "./steps/staff-display-step"
import { DateTimeStep } from "./steps/date-time-step"
import { CustomerInfoStep } from "./steps/customer-info-step"
import { BookingSummaryCard } from "./booking-summary-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SparkleIcon } from "@/components/icons"

import { BookingFormProps, BookingFormValues } from "@/lib/interfaces"

export function BookingForm(props: BookingFormProps) {
  const {
    salonConfig,
    isAuthenticated,
    isEmployee,
    defaultValues = {},
  } = props

  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")

  // Determine mode
  const isStaffFirst = props.mode === "staff-first"

  // Get the selected service based on mode
  const getSelectedService = () => {
    if (isStaffFirst) {
      return props.staffServices.find((s) => s.id === selectedServiceId)
    }
    return props.service
  }

  const selectedService = getSelectedService()

  // Use appropriate schema based on authentication status
  const schema = isAuthenticated ? authenticatedBookingSchema : bookingSchema

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema) as never,
    mode: "onChange",
    defaultValues: {
      staffId: isStaffFirst ? props.preselectedStaff.id : "",
      date: undefined,
      time: "",
      firstName: defaultValues.firstName || "",
      lastName: defaultValues.lastName || "",
      email: defaultValues.email || "",
      phone: "",
      notes: "",
    },
  })

  // useWatch is more compatible with React Compiler than watch()
  const staffId = useWatch({ control, name: "staffId" })
  const selectedDate = useWatch({ control, name: "date" })
  const selectedTime = useWatch({ control, name: "time" })

  // Handle service selection in staff-first mode
  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId)
  }

  const onSubmit = async (data: BookingFormValues) => {
    // Validate service is selected in staff-first mode
    if (isStaffFirst && !selectedServiceId) {
      setError("Please select a service")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (!data.date) {
        setError("Please select a date")
        setSubmitting(false)
        return
      }

      // Get the service ID based on mode
      const serviceId = isStaffFirst ? selectedServiceId : props.service.id

      // Combine date and time into a single datetime
      const [hours, minutes] = data.time.split(":").map(Number)
      const startTime = new Date(data.date)
      startTime.setHours(hours, minutes, 0, 0)

      // Employee flow: Create appointment directly (no Stripe payment required)
      if (isEmployee) {
        const result = await createAppointment({
          serviceIds: [serviceId],
          staffId: data.staffId,
          startTime,
          guestPhone: data.phone || undefined,
          notes: data.notes || undefined,
          isEmployee: true, // Apply 20% discount, no deposit
        })

        if (result.success && result.appointmentId) {
          // Redirect to my-appointments with success message
          router.push(`/my-appointments?new=${result.appointmentId}`)
        } else {
          setError(result.error || "Failed to create appointment")
          setSubmitting(false)
        }
        return
      }

      // Regular customer flow: Create Stripe Checkout session and redirect to payment
      const result = await createCheckoutSession({
        serviceIds: [serviceId],
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
        window.location.assign(result.checkoutUrl)
      } else {
        setError(result.error || "Failed to create payment session")
        setSubmitting(false)
      }
    } catch (err) {
      console.error("Error creating booking:", err)
      setError("An unexpected error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Employee Banner */}
      {isEmployee && (
        <Alert className="mb-6 border-primary/30 bg-linear-to-r from-primary/5 via-primary/10 to-accent/5 dark:border-primary/40 dark:from-primary/10 dark:via-primary/15 dark:to-accent/10">
          <SparkleIcon size={18} className="text-primary dark:text-primary" />
          <AlertDescription className="text-foreground/80 dark:text-foreground/90">
            You&apos;re booking as an employee. A <strong className="text-primary">20% discount</strong> will be applied to your appointment.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Form Steps */}
        <div className="space-y-6 lg:col-span-2">
          {/* Staff-first mode: Show preselected staff, then service selection */}
          {isStaffFirst ? (
            <>
              {/* Step 0: Staff Display (Read-only) */}
              <StaffDisplayStep staff={props.preselectedStaff} />

              {/* Step 1: Service Selection */}
              <ServiceSelectionStep
                services={props.staffServices}
                selectedServiceId={selectedServiceId}
                onSelectService={handleServiceSelect}
                error={!selectedServiceId && error ? "Please select a service" : undefined}
              />
            </>
          ) : (
            <>
              {/* Service-first mode: Show service, then staff selection */}
              {/* Step 1: Service Display (Read-only) */}
              <ServiceStep service={props.service} />

              {/* Step 2: Staff Selection */}
              <StaffStep
                availableStaff={props.availableStaff}
                selectedStaffId={staffId}
                onSelectStaff={(id) =>
                  setValue("staffId", id, { shouldValidate: true })
                }
                error={errors.staffId?.message}
              />
            </>
          )}

          {/* Step 3: Date & Time Selection */}
          <DateTimeStep
            selectedStaffId={staffId}
            serviceDuration={selectedService?.duration || 60}
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
            service={selectedService || null}
            selectedStaff={
              isStaffFirst
                ? props.preselectedStaff
                : props.availableStaff.find((s) => s.id === staffId)
            }
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            salonConfig={salonConfig}
            submitting={submitting}
            error={error}
            isEmployee={isEmployee}
            availableSlots={[]}
          />
        </div>
      </div>
    </form>
  )
}
