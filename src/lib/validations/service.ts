import { z } from "zod"

// Base schema with common fields
const serviceBaseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  duration: z
    .number({ invalid_type_error: "Duration is required" })
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration must be less than 8 hours"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, "Price must be positive"),
  imageUrl: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  staffIds: z.array(z.string()).optional(),
})

// Schema for creating services
export const createServiceSchema = serviceBaseSchema

// Schema for updating services (same validation rules)
export const updateServiceSchema = serviceBaseSchema

export type CreateServiceFormData = z.infer<typeof createServiceSchema>
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>
export type ServiceFormData = CreateServiceFormData | UpdateServiceFormData
