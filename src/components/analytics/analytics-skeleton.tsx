import { Card } from "@tremor/react"

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-muted ${className}`} />
  )
}

function KPICardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-8 w-32" />
        </div>
        <SkeletonPulse className="h-10 w-10 rounded-lg" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <SkeletonPulse className="h-5 w-16" />
        <SkeletonPulse className="h-4 w-24" />
      </div>
    </Card>
  )
}

function ChartCardSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <Card className="p-4 sm:p-6">
      <SkeletonPulse className="h-6 w-40" />
      <SkeletonPulse className="mt-2 h-4 w-56" />
      <SkeletonPulse className={`mt-6 w-full ${height}`} />
    </Card>
  )
}

function BarListSkeleton() {
  return (
    <Card className="h-full p-4 sm:p-6">
      <SkeletonPulse className="h-6 w-32" />
      <SkeletonPulse className="mt-2 h-4 w-40" />
      <div className="mt-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonPulse className="h-4 flex-1" />
            <SkeletonPulse className="h-4 w-12" />
          </div>
        ))}
      </div>
    </Card>
  )
}

function DonutSkeleton() {
  return (
    <Card className="h-full p-4 sm:p-6">
      <SkeletonPulse className="h-6 w-44" />
      <SkeletonPulse className="mt-2 h-4 w-36" />
      <div className="mt-6 flex flex-col items-center">
        <SkeletonPulse className="h-52 w-52 rounded-full" />
        <div className="mt-6 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonPulse key={i} className="h-4 w-16" />
          ))}
        </div>
      </div>
    </Card>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SkeletonPulse className="h-8 w-32" />
          <SkeletonPulse className="mt-2 h-4 w-48" />
        </div>
        <SkeletonPulse className="h-10 w-44" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Revenue Chart */}
      <ChartCardSkeleton />

      {/* Middle Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarListSkeleton />
        <BarListSkeleton />
        <DonutSkeleton />
      </div>

      {/* Staff Performance */}
      <ChartCardSkeleton />
    </div>
  )
}
