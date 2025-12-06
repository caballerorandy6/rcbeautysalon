import { Suspense } from "react"
import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { RegisterSkeleton } from "@/components/auth/register-skeleton"

export const metadata: Metadata = {
  title: "Create Account | RC Beauty Salon",
  description: "Create your RC Beauty Salon account to book appointments, shop products, and manage your beauty experience.",
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterForm />
    </Suspense>
  )
}
