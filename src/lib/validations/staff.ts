import { z } from "zod"

// Working hours schema for a single day
const workingHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isActive: z.boolean(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
})

// Base schema with common fields
const staffBaseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()).optional(),
  workingHours: z.array(workingHourSchema).optional(),
})

// Schema for creating staff
export const createStaffSchema = staffBaseSchema

// Schema for updating staff
export const updateStaffSchema = staffBaseSchema

// Schema for staff self-update (limited fields)
export const staffSelfUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
})

export type WorkingHourFormData = z.infer<typeof workingHourSchema>
export type CreateStaffFormData = z.infer<typeof createStaffSchema>
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>
export type StaffFormData = CreateStaffFormData | UpdateStaffFormData
export type StaffSelfUpdateFormData = z.infer<typeof staffSelfUpdateSchema>
