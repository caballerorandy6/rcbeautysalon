import { z } from "zod"

export const adminAppointmentSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  staffId: z.string().min(1, "Please select a staff member"),
  date: z.date({ message: "Please select a date" }),
  time: z
    .string()
    .min(1, "Please select a time")
    .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format",
    }),
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  customerPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .refine((val) => /^[\d\s\-\(\)\+]+$/.test(val), {
      message: "Please enter a valid phone number",
    }),
  customerEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .optional(),
})

export type AdminAppointmentInput = z.infer<typeof adminAppointmentSchema>
