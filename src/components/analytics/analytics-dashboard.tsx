"use client"

import { KPICards } from "./kpi-cards"
import { RevenueChart } from "./revenue-chart"
import { TopServicesChart } from "./top-services-chart"
import { TopProductsChart } from "./top-products-chart"
import { AppointmentsStatusChart } from "./appointments-status-chart"
import { StaffPerformanceChart } from "./staff-performance-chart"
import { PeriodSelector } from "./period-selector"
import {
  KPIData,
  RevenueDataPoint,
  TopService,
  TopProduct,
  AppointmentsByStatus,
  StaffPerformance,
  PeriodType,
} from "@/lib/interfaces"

interface AnalyticsDashboardProps {
  data: {
    kpi: KPIData
    revenue: RevenueDataPoint[]
    topServices: TopService[]
    topProducts: TopProduct[]
    appointmentsStatus: AppointmentsByStatus[]
    staffPerformance: StaffPerformance[]
  }
  period: PeriodType
}

export function AnalyticsDashboard({ data, period }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your business performance and trends
          </p>
        </div>
        <PeriodSelector value={period} />
      </div>

      {/* KPI Cards */}
      <KPICards data={data.kpi} />

      {/* Revenue Chart - Full Width */}
      <RevenueChart data={data.revenue} />

      {/* Middle Row - 3 columns on desktop, stack on mobile */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <TopServicesChart data={data.topServices} />
        <TopProductsChart data={data.topProducts} />
        <div className="md:col-span-2 xl:col-span-1">
          <AppointmentsStatusChart data={data.appointmentsStatus} />
        </div>
      </div>

      {/* Staff Performance - Full Width */}
      <StaffPerformanceChart data={data.staffPerformance} />
    </div>
  )
}
