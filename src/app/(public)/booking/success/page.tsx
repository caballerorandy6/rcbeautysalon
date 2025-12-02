import { Suspense } from "react"
import Link from "next/link"
import { CheckCircle, CalendarCheck, House } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyCheckoutSession } from "@/app/actions/stripe"

export const metadata = {
  title: "Booking Confirmed | RC Beauty Salon",
  description: "Your appointment has been successfully booked",
}

async function BookingSuccessContent({
  sessionId,
}: {
  sessionId: string | null
}) {
  if (!sessionId) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Session</CardTitle>
          <CardDescription>
            No payment session found. Please try booking again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/services">Back to Services</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const result = await verifyCheckoutSession(sessionId)

  if (!result.success || result.status !== "paid") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-destructive">Payment Not Completed</CardTitle>
          <CardDescription>
            Your payment was not completed. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/services">Back to Services</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle size={48} weight="fill" className="text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
        <CardDescription className="text-base">
          Your appointment has been successfully booked and your deposit payment has been processed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/50 p-4 text-sm">
          <p className="text-muted-foreground">
            A confirmation email has been sent to{" "}
            <strong className="text-foreground">{result.customerEmail}</strong>{" "}
            with all the details of your appointment.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/my-appointments">
              <CalendarCheck size={20} className="mr-2" weight="regular" />
              View My Appointments
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <House size={20} className="mr-2" weight="regular" />
              Back to Home
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id || null

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <Card className="mx-auto max-w-lg text-center">
            <CardContent className="py-12">
              <p className="text-muted-foreground">Verifying payment...</p>
            </CardContent>
          </Card>
        }
      >
        <BookingSuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  )
}
