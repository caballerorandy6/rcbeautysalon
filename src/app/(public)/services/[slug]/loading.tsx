import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ServiceDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Back Button Skeleton */}
      <div className="container mx-auto px-4 pt-8">
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Service Detail Skeleton */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image Skeleton */}
            <Skeleton className="h-[400px] lg:h-[600px] rounded-2xl" />

            {/* Content Skeleton */}
            <div>
              {/* Category Badge */}
              <Skeleton className="mb-4 h-6 w-24" />

              {/* Title */}
              <Skeleton className="mb-6 h-12 w-3/4" />

              {/* Description */}
              <div className="mb-8 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Service Details Cards */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-16" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              </div>

              {/* Staff Section Skeleton */}
              <div className="mb-8">
                <Skeleton className="mb-4 h-7 w-40" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={i} className="border-primary/10">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Book Button Skeleton */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-full sm:w-48" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section Skeleton */}
      <section className="border-t border-primary/30 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Skeleton className="mx-auto mb-8 h-9 w-64" />
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="mb-2 h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
