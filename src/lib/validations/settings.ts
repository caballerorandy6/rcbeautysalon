import { z } from "zod"

export const settingsSchema = z.object({
  name: z.string().min(1, "Salon name is required").max(100),
  logo: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(100).optional().or(z.literal("")),
  zipCode: z.string().max(20).optional().or(z.literal("")),
  country: z.string().min(1),
  timezone: z.string().min(1),
  currency: z.string().min(1),
  bookingDeposit: z.number({ error: "Deposit is required" }).min(0),
  depositRefundable: z.boolean(),
  minBookingAdvance: z.number({ error: "Min advance is required" }).min(0),
  maxBookingAdvance: z.number({ error: "Max advance is required" }).min(1),
  cancellationPolicy: z.string().optional().or(z.literal("")),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
