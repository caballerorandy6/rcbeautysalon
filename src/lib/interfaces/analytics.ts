// Analytics interfaces - These define the data shape for your queries

export interface KPIData {
  totalRevenue: number
  totalAppointments: number
  totalOrders: number
  totalCustomers: number
  // Comparisons with previous period (percentage change)
  revenueChange: number
  appointmentsChange: number
  ordersChange: number
  customersChange: number
}

export interface RevenueDataPoint {
  date: string // Format: "Jan 1", "Jan 2", etc.
  appointments: number // Revenue from appointments
  products: number // Revenue from product sales
}

export interface TopService {
  name: string
  bookings: number
  revenue: number
}

export interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export interface AppointmentsByStatus {
  status: string
  count: number
}

export interface StaffPerformance {
  name: string
  appointments: number
  revenue: number
}

export interface RevenueByCategory {
  category: string
  revenue: number
}

export interface AnalyticsPeriod {
  startDate: Date
  endDate: Date
  previousStartDate: Date
  previousEndDate: Date
}

// Helper to get date ranges
export type PeriodType = "7d" | "30d" | "90d" | "12m"
