import { Skeleton } from "@/components/ui/skeleton"

export function ServicesListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter Skeleton */}
      <div className="space-y-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
          <Skeleton className="h-10 w-10 shrink-0" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Services Grid Skeleton */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
            >
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
