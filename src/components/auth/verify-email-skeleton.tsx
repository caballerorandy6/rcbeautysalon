import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function VerifyEmailSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-6 flex justify-center">
            <div className="bg-muted h-16 w-32 animate-pulse rounded-md" />
          </div>
          <div className="bg-muted mx-auto h-8 w-48 animate-pulse rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted mx-auto h-4 w-64 animate-pulse rounded-md" />
          <div className="bg-muted mx-auto h-4 w-56 animate-pulse rounded-md" />
          <div className="bg-muted mx-auto h-11 w-full animate-pulse rounded-md" />
        </CardContent>
      </Card>
    </div>
  )
}
