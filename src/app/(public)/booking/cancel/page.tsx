import Link from "next/link"
import { XCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Booking Cancelled | RC Beauty Salon",
  description: "Your booking was cancelled",
}

export default function BookingCancelPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <XCircle size={48} weight="regular" className="text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Booking Cancelled</CardTitle>
          <CardDescription className="text-base">
            Your payment was cancelled and no appointment was created.
            Don&apos;t worry, you haven&apos;t been charged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            If you experienced any issues during checkout, please contact us
            or try booking again.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/services">
                <ArrowLeft size={20} className="mr-2" weight="regular" />
                Back to Services
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
