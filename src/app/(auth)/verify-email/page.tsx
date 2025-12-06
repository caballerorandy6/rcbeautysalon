import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { verifyEmail } from "@/app/actions/auth"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VerifyEmailSkeleton } from "@/components/auth/verify-email-skeleton"
import { CheckCircleIcon } from "@/components/icons/check-circle-icon"
import { XCircleIcon } from "@/components/icons/x-circle-icon"

export const metadata: Metadata = {
  title: "Verify Email | RC Beauty Salon",
  description: "Verify your RC Beauty Salon account email address.",
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

async function VerifyEmailContent({ token }: { token: string }) {
  const result = await verifyEmail(token)

  if (result?.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-6 flex justify-center">
            <Logo variant="auth" />
          </div>
          <div className="flex justify-center">
            <CheckCircleIcon size={64} weight="fill" className="text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. You can now log in to
            your account.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="mb-6 flex justify-center">
          <Logo variant="auth" />
        </div>
        <div className="flex justify-center">
          <XCircleIcon size={64} weight="fill" className="text-destructive" />
        </div>
        <CardTitle className="text-center text-2xl">
          Verification Failed
        </CardTitle>
        <CardDescription className="text-center">
          {result?.errors?.[0]?.message ||
            "The verification link is invalid or has expired."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center text-sm">
          Please try registering again to receive a new verification link.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button asChild className="w-full" size="lg">
          <Link href="/register">Register Again</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams

  if (!token) {
    redirect("/register")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<VerifyEmailSkeleton />}>
        <VerifyEmailContent token={token} />
      </Suspense>
    </div>
  )
}
