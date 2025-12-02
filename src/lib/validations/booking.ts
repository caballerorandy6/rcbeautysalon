import { z } from "zod"

export const bookingSchema = z.object({
  staffId: z.string().min(1, "Please select a staff member"),
  date: z.date({ message: "Please select a date" }),
  time: z
    .string()
    .min(1, "Please select a time")
    .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format",
    }),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .refine((val) => /^[\d\s\-\(\)\+]+$/.test(val), {
      message: "Please enter a valid phone number",
    }),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .optional(),
})

// Schema for authenticated users (firstName, lastName, email are optional/disabled)
export const authenticatedBookingSchema = bookingSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>
export type AuthenticatedBookingInput = z.infer<typeof authenticatedBookingSchema>
