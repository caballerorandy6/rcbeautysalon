import { Suspense } from "react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import {
  getKPIData,
  getRevenueChartData,
  getTopServices,
  getTopProducts,
  getAppointmentsByStatus,
  getStaffPerformance,
} from "@/app/actions/analytics"
import { PeriodType } from "@/lib/interfaces"
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton"

export const metadata = {
  title: "Analytics | RC Beauty Salon",
  description: "Business performance analytics and reports",
}

interface AnalyticsPageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const params = await searchParams
  const period = (params.period as PeriodType) || "30d"

  // Validate period
  const validPeriods: PeriodType[] = ["7d", "30d", "90d", "12m"]
  const validPeriod = validPeriods.includes(period) ? period : "30d"

  // Fetch all data in parallel on the server
  const [kpi, revenue, topServices, topProducts, appointmentsStatus, staffPerformance] =
    await Promise.all([
      getKPIData(validPeriod),
      getRevenueChartData(validPeriod),
      getTopServices(validPeriod),
      getTopProducts(validPeriod),
      getAppointmentsByStatus(validPeriod),
      getStaffPerformance(validPeriod),
    ])

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard
          data={{
            kpi,
            revenue,
            topServices,
            topProducts,
            appointmentsStatus,
            staffPerformance,
          }}
          period={validPeriod}
        />
      </Suspense>
    </div>
  )
}
