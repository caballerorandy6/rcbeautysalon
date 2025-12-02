import { Decimal } from "@prisma/client/runtime/library"

export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: Decimal
  duration: number
  imageUrl: string | null
  isActive: boolean
  isFeatured: boolean
  order: number
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ServiceWithCategory extends Service {
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export interface ServiceDetail extends ServiceWithCategory {
  staffServices: {
    staff: {
      id: string
      name: string
      email: string | null
      phone: string | null
      bio: string | null
      image: string | null
      isActive: boolean
    }
  }[]
  reviews: Review[]
  gallery: GalleryImage[]
  faqs: FAQ[]
}

export interface Review {
  id: string
  rating: number
  comment: string
  serviceId: string
  userId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

export interface GalleryImage {
  id: string
  imageUrl: string
  caption: string | null
  order: number
  serviceId: string
  createdAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  serviceId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface CategoryWithCount extends Category {
  _count: {
    services: number
  }
}

export interface Staff {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  image: string | null
  isActive: boolean
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StaffWithServices extends Staff {
  services: {
    service: Service
  }[]
}

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  password: string | null
  role: "ADMIN" | "STAFF" | "CLIENTE"
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  staffId: string
  customerId: string | null
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  startTime: Date
  endTime: Date
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  notes: string | null
  totalPrice: Decimal
  depositAmount: Decimal
  depositPaid: boolean
  stripePaymentId: string | null
  reminderSentAt: Date | null
  confirmationSentAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentWithDetails extends Appointment {
  staff: Staff
  customer: Customer | null
  services: {
    service: Service
  }[]
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: Decimal
  compareAtPrice: Decimal | null
  sku: string | null
  trackInventory: boolean
  stockQuantity: number
  images: string[]
  categoryId: string | null
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductWithCategory extends Product {
  category: Category | null
}

export interface Order {
  id: string
  customerId: string | null
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  subtotal: Decimal
  tax: Decimal
  total: Decimal
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "REFUNDED"
  stripePaymentIntentId: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderWithDetails extends Order {
  customer: Customer | null
  items: {
    id: string
    quantity: number
    price: Decimal
    product: Product
  }[]
}

export interface SalonConfig {
  id: string
  name: string
  logo: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string
  timezone: string
  currency: string
  locale: string
  bookingDeposit: Decimal
  depositRefundable: boolean
  minBookingAdvance: number
  maxBookingAdvance: number
  cancellationPolicy: string | null
  createdAt: Date
  updatedAt: Date
}

export interface WorkingHours {
  id: string
  staffId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface StaffWithWorkingHours extends Staff {
  workingHours: WorkingHours[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ============================================
// SERVICE FILTER INTERFACES
// ============================================

export interface ServiceFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  staffId?: string
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "duration_asc"
    | "duration_desc"
    | "name_asc"
    | "rating_desc"
    | "popularity_desc"
}

export interface CategoryOption {
  id: string
  name: string
}

export interface StaffOption {
  id: string
  name: string
}

export interface ServicesFilterProps {
  categories: CategoryOption[]
  staff: StaffOption[]
  onFilterChange: (filters: ServiceFilters) => void
  isLoading: boolean
}

export interface ServiceListItem {
  id: string
  name: string
  slug: string
  description: string | null
  duration: number
  price: number
  imageUrl: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export interface CreateServiceInput {
  name: string
  slug: string
  description?: string
  duration: number
  price: number
  imageUrl?: string
  categoryId?: string
  isActive?: boolean
  isFeatured?: boolean
  order?: number
}

export interface ServicesListProps {
  initialServices: Record<string, ServiceListItem[]>
  categories: CategoryOption[]
  staff: StaffOption[]
}

export interface ReviewFormData {
  rating: number
  comment: string
  serviceId: string
}

export interface ReviewFormProps {
  serviceId: string
  serviceName: string
}

export interface RelatedService {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  duration: number
  imageUrl: string | null
}

export interface TimeSlot {
  time: string // "09:00", "10:00", etc.
  available: boolean
  formattedTime: string // "9:00 AM", "10:00 AM", etc.
}

export interface AvailableStaffMember {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  image: string | null
  isActive: boolean
}

export interface BookingFormData {
  serviceIds: string[]
  staffId: string
  date: Date
  time: string // "09:00"
  // Customer info
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
}

export interface CreateAppointmentData {
  serviceIds: string[]
  staffId: string
  startTime: Date
  // Customer info (guest or authenticated)
  customerId?: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  notes?: string
}

export interface AppointmentCreationResult {
  success: boolean
  appointmentId?: string
  error?: string
  stripeClientSecret?: string
}

export interface CreateStaffInput {
    name: string
    email: string
    phone?: string
    bio?: string
    image?: string
    isActive?: boolean
  }