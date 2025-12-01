/**
 * Centralized Type Definitions
 * All types used across the application that mirror Prisma enums
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = "ADMIN" | "STAFF" | "CLIENTE"

// ============================================
// APPOINTMENT TYPES
// ============================================

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED"

// ============================================
// UTILITY TYPES
// ============================================

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // Sunday (0) to Saturday (6)

// ============================================
// SERVICE FILTER & SORT TYPES
// ============================================

export type ServiceSortBy =
  | "price_asc"
  | "price_desc"
  | "duration_asc"
  | "duration_desc"
  | "name_asc"
  | "rating_desc"
  | "popularity_desc"
