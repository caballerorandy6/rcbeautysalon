import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  salonName: z.string().min(2, "Salon name must be at least 2 characters"),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
