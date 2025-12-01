import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ResetPasswordSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Logo skeleton */}
          <div className="mb-6 flex justify-center">
            <div className="bg-muted h-16 w-32 animate-pulse rounded-md" />
          </div>
          {/* Title skeleton */}
          <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded-md" />
          {/* Description skeleton */}
          <div className="bg-muted mx-auto h-4 w-64 animate-pulse rounded-md" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Password field skeleton */}
          <div className="space-y-2">
            <div className="bg-muted h-4 w-20 animate-pulse rounded-md" />
            <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
          </div>
          {/* Confirm password field skeleton */}
          <div className="space-y-2">
            <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
            <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Button skeleton */}
          <div className="bg-muted h-11 w-full animate-pulse rounded-md" />

          <Separator />

          {/* Footer text skeleton */}
          <div className="bg-muted mx-auto h-4 w-48 animate-pulse rounded-md" />
          <div className="bg-muted mx-auto h-4 w-28 animate-pulse rounded-md" />
        </CardFooter>
      </Card>
    </div>
  )
}
