"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingSchema, authenticatedBookingSchema, type BookingInput } from "@/lib/validations/booking"
import { createAppointment } from "@/app/actions/appointments"
import { AvailableStaffMember } from "@/lib/interfaces"
import { ServiceStep } from "./steps/service-step"
import { StaffStep } from "./steps/staff-step"
import { DateTimeStep } from "./steps/date-time-step"
import { CustomerInfoStep } from "./steps/customer-info-step"
import { BookingSummaryCard } from "./booking-summary-card"

interface BookingFormProps {
  service: {
    id: string
    name: string
    price: number
    duration: number
    category: { name: string } | null
  }
  availableStaff: AvailableStaffMember[]
  salonConfig: {
    bookingDeposit: number
    depositRefundable: boolean
    maxBookingAdvance: number
  }
  isAuthenticated: boolean
  defaultValues?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

export function BookingForm({
  service,
  availableStaff,
  salonConfig,
  isAuthenticated,
  defaultValues = {},
}: BookingFormProps) {
  const router = useRouter()
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
  } = useForm<BookingInput>({
    resolver: zodResolver(schema),
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

  const onSubmit = async (data: BookingInput) => {
    setSubmitting(true)
    setError(null)

    try {
      // Combine date and time into a single datetime
      const [hours, minutes] = data.time.split(":").map(Number)
      const startTime = new Date(data.date)
      startTime.setHours(hours, minutes, 0, 0)

      const result = await createAppointment({
        serviceIds: [service.id],
        staffId: data.staffId,
        startTime,
        guestName: !isAuthenticated ? `${data.firstName} ${data.lastName}` : undefined,
        guestEmail: !isAuthenticated ? data.email : undefined,
        guestPhone: data.phone || undefined,
        notes: data.notes || undefined,
      })

      if (result.success) {
        router.push(`/my-appointments?new=${result.appointmentId}`)
      } else {
        setError(result.error || "Failed to create appointment")
        setSubmitting(false)
      }
    } catch (err) {
      console.error("Error creating appointment:", err)
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
            onSelectStaff={(id) => setValue("staffId", id, { shouldValidate: true })}
            error={errors.staffId?.message}
          />

          {/* Step 3: Date & Time Selection */}
          <DateTimeStep
            selectedStaffId={staffId}
            serviceDuration={service.duration}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(date) => setValue("date", date, { shouldValidate: true })}
            onSelectTime={(time) => setValue("time", time, { shouldValidate: true })}
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
