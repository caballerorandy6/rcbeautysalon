// Basic type definitions

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN"

export type TenantMemberRole = "OWNER" | "ADMIN" | "MANAGER" | "MEMBER"

export type SubscriptionPlan = "FREE_TRIAL" | "BASIC" | "PRO" | "ENTERPRISE"

export type TenantStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED" | "TRIAL"

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
