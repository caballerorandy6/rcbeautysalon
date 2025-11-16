import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function LoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Logo skeleton */}
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          </div>
          {/* Title skeleton */}
          <div className="mx-auto h-8 w-48 animate-pulse rounded-md bg-muted" />
          {/* Description skeleton */}
          <div className="mx-auto h-4 w-56 animate-pulse rounded-md bg-muted" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
          {/* Password field skeleton */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Button skeleton */}
          <div className="h-11 w-full animate-pulse rounded-md bg-muted" />

          <Separator />

          {/* Footer text skeleton */}
          <div className="mx-auto h-4 w-64 animate-pulse rounded-md bg-muted" />
          <div className="mx-auto h-4 w-32 animate-pulse rounded-md bg-muted" />
        </CardFooter>
      </Card>
    </div>
  )
}
