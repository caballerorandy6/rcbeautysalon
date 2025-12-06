import { Suspense } from "react"
import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { ForgotPasswordSkeleton } from "@/components/auth/forgot-password-skeleton"

export const metadata: Metadata = {
  title: "Forgot Password | RC Beauty Salon",
  description: "Reset your RC Beauty Salon account password.",
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
