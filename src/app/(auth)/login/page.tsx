import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { LoginSkeleton } from "@/components/skeletons/login-skeleton"

export const metadata: Metadata = {
  title: "Sign In | RC Beauty Salon",
  description:
    "Sign in to your RC Beauty Salon account to manage appointments, view services, and access exclusive features.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
