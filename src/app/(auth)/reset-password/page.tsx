import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { ResetPasswordSkeleton } from "@/components/auth/reset-password-skeleton"

export const metadata: Metadata = {
  title: "Reset Password | RC Beauty Salon",
  description: "Create a new password for your RC Beauty Salon account.",
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams

  if (!token) {
    redirect("/forgot-password")
  }

  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm token={token} />
    </Suspense>
  )
}
