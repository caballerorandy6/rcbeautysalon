# Beauty Salon - Project Documentation

## React & Next.js Performance Rules

**IMPORTANT:** Follow all performance optimization rules when writing, reviewing, or refactoring React/Next.js code. These are 47 rules from Vercel Engineering, ordered by impact (CRITICAL → LOW).

---

## CRITICAL IMPACT

### Eliminating Waterfalls (Section 1)

1. **Defer Await Until Needed** — Move `await` operations into branches where actually used to prevent blocking unused code paths
2. **Dependency-Based Parallelization** — Use tools like `better-all` to maximize parallelism by starting tasks at the earliest possible moment
3. **Prevent Waterfall Chains in API Routes** — Start independent operations immediately, even before awaiting them
4. **Promise.all() for Independent Operations** — Execute concurrent async operations without interdependencies in parallel
5. **Strategic Suspense Boundaries** — Use Suspense to show wrapper UI faster while data loads asynchronously

### Bundle Size Optimization (Section 2)

6. **Avoid Barrel File Imports** — Import directly from source files instead of entry points; barrel files can take "200-800ms just to import them"
7. **Conditional Module Loading** — Load large data or modules only when a feature is activated
8. **Defer Non-Critical Third-Party Libraries** — Load analytics, logging, and error tracking after hydration
9. **Dynamic Imports for Heavy Components** — Use `next/dynamic` to lazy-load large components not needed on initial render
10. **Preload Based on User Intent** — Preload heavy bundles on hover/focus or when feature flags enable functionality

---

## HIGH IMPACT

### Server-Side Performance (Section 3)

11. **Cross-Request LRU Caching** — Implement LRU cache for data shared across sequential requests
12. **Minimize Serialization at RSC Boundaries** — Only pass fields that client components actually use to reduce data transfer size
13. **Parallel Data Fetching with Component Composition** — Restructure components to parallelize server-side data fetching
14. **Per-Request Deduplication with React.cache()** — Use `React.cache()` for server-side request deduplication within a single request
15. **Use after() for Non-Blocking Operations** — Schedule logging, analytics, and side effects after response is sent

---

## MEDIUM-HIGH IMPACT

### Client-Side Data Fetching (Section 4)

16. **Deduplicate Global Event Listeners** — Use `useSWRSubscription()` to share global event listeners across component instances
17. **Use Passive Event Listeners for Scrolling** — Add `{ passive: true }` to touch and wheel listeners to enable immediate scrolling
18. **Use SWR for Automatic Deduplication** — Enable request deduplication and caching across component instances
19. **Version and Minimize localStorage Data** — Add version prefixes and store only needed fields to prevent schema conflicts

---

## MEDIUM IMPACT

### Re-render Optimization (Section 5)

20. **Defer State Reads to Usage Point** — Don't subscribe to dynamic state if only reading it inside callbacks
21. **Extract to Memoized Components** — Extract expensive work into memoized components to enable early returns
22. **Narrow Effect Dependencies** — Specify primitive dependencies instead of objects to minimize effect re-runs
23. **Subscribe to Derived State** — Subscribe to derived boolean state instead of continuous values
24. **Use Functional setState Updates** — Use functional update form to prevent stale closures and unnecessary recreations
25. **Use Lazy State Initialization** — Pass a function to `useState` for expensive initial values
26. **Use Transitions for Non-Urgent Updates** — Mark frequent, non-urgent state updates as transitions with `startTransition()`

### Rendering Performance (Section 6)

27. **Animate SVG Wrapper Instead of SVG Element** — Wrap SVG in a `<div>` and animate the wrapper for hardware acceleration
28. **CSS content-visibility for Long Lists** — Apply `content-visibility: auto` to defer off-screen rendering
29. **Hoist Static JSX Elements** — Extract static JSX outside components to avoid re-creation
30. **Optimize SVG Precision** — Reduce SVG coordinate precision with tools like SVGO to decrease file size
31. **Prevent Hydration Mismatch Without Flickering** — Use synchronous inline scripts to update DOM before React hydration
32. **Use Activity Component for Show/Hide** — Use React's `<Activity>` to preserve state/DOM for frequently toggled components
33. **Use Explicit Conditional Rendering** — Use ternary operators to prevent rendering falsy values like `0` or `NaN`

---

## LOW-MEDIUM IMPACT

### JavaScript Performance (Section 7)

34. **Batch DOM CSS Changes** — Group multiple CSS changes via classes or `cssText` to minimize browser reflows
35. **Build Index Maps for Repeated Lookups** — Use Map for O(1) lookups instead of repeated `.find()` calls
36. **Cache Property Access in Loops** — Cache object property lookups in hot paths to reduce lookups
37. **Cache Repeated Function Calls** — Use module-level Map to cache function results for same inputs
38. **Cache Storage API Calls** — Cache `localStorage`, `sessionStorage`, and cookie reads in memory
39. **Combine Multiple Array Iterations** — Merge multiple `.filter()` or `.map()` calls into single loop
40. **Early Length Check for Array Comparisons** — Check array lengths first before expensive comparisons
41. **Early Return from Functions** — Return immediately when result is determined to skip unnecessary processing
42. **Hoist RegExp Creation** — Don't create RegExp inside render; hoist to module scope or memoize
43. **Use Loop for Min/Max Instead of Sort** — Find smallest/largest element with O(n) loop instead of O(n log n) sort
44. **Use Set/Map for O(1) Lookups** — Convert arrays to Set/Map for repeated membership checks
45. **Use toSorted() Instead of sort() for Immutability** — Create new sorted array without mutating original

---

## LOW IMPACT

### Advanced Patterns (Section 8)

46. **Store Event Handlers in Refs** — Store callbacks in refs when used in effects that shouldn't re-subscribe
47. **useLatest for Stable Callback Refs** — Access latest values in callbacks without adding to dependency arrays

---

## Key Themes

- **Waterfalls are the #1 performance killer** — Eliminate sequential awaits through parallelization
- **Bundle size directly impacts TTI/LCP** — Aggressive tree-shaking via direct imports and dynamic loading
- **Serialization at RSC boundaries is expensive** — Only pass necessary data across client/server boundary
- **Prefer composition for parallelism** — Structure React Server Components for concurrent data fetching
- **Immutability prevents React bugs** — Use `.toSorted()` and functional updates to avoid mutation issues
- **Note:** With React Compiler enabled, manual memoization via `memo()` and `useMemo()` becomes unnecessary

---

## About the Project

Professional beauty salon management platform with appointment booking, e-commerce, staff portal, and admin dashboard. Built for small to medium beauty businesses.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript 5 (strict) |
| React | React 19.2 + React Compiler |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Phosphor Icons |
| Database | PostgreSQL + Prisma 6.19 |
| Global State | Zustand |
| Forms | React Hook Form + Zod |
| Authentication | NextAuth v5 (beta) - JWT strategy |
| Payments | Stripe |
| Email | Resend + React Email |
| Date Handling | date-fns |
| Hosting | Vercel |

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public pages (no auth)
│   │   ├── page.tsx               # Homepage
│   │   ├── services/              # Services catalog
│   │   ├── staff/                 # Staff directory
│   │   └── booking/               # Public booking
│   │
│   ├── (auth)/                    # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   │
│   ├── (customer)/                # Customer portal
│   │   ├── booking/               # Appointment booking
│   │   ├── shop/                  # Product store
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Stripe checkout
│   │   ├── my-appointments/       # View appointments
│   │   ├── my-orders/             # View orders
│   │   ├── my-reviews/            # View reviews
│   │   └── my-account/            # Account settings
│   │
│   ├── (staff)/                   # Staff portal
│   │   └── staff-portal/
│   │       ├── appointments/      # Assigned appointments
│   │       ├── schedule/          # Working hours
│   │       └── profile/           # Staff profile
│   │
│   ├── (admin)/                   # Admin dashboard
│   │   └── dashboard/
│   │       ├── appointments/      # Manage appointments
│   │       ├── services/          # CRUD services
│   │       ├── products/          # CRUD products
│   │       ├── staff/             # CRUD staff
│   │       ├── users/             # User management
│   │       ├── orders/            # Order management
│   │       └── settings/          # Salon config
│   │
│   ├── api/                       # API routes
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   ├── upload/                # Image upload
│   │   └── webhooks/stripe/       # Stripe webhooks
│   │
│   └── actions/                   # Server Actions (15+ files)
│       ├── auth.ts                # Registration, password reset
│       ├── appointments.ts        # Booking logic
│       ├── stripe.ts              # Stripe integration
│       ├── services.ts            # Service queries
│       ├── products.ts            # Product management
│       ├── staff.ts               # Staff management
│       ├── orders.ts              # Order management
│       └── ...
│
├── components/
│   ├── ui/                        # shadcn/ui primitives (20+)
│   ├── providers/                 # Context providers
│   ├── layouts/                   # Header, Footer, Sidebar
│   ├── booking/                   # Booking flow components
│   ├── admin/                     # Admin components
│   ├── shop/                      # E-commerce components
│   └── ...
│
├── lib/
│   ├── auth/auth.ts               # NextAuth config
│   ├── email/                     # Email templates
│   ├── validations/               # Zod schemas
│   ├── prisma.ts                  # Prisma client
│   ├── stripe.ts                  # Stripe config
│   ├── interfaces.ts              # TypeScript interfaces
│   ├── types.ts                   # Type definitions
│   └── utils.ts                   # Utilities
│
├── hooks/                         # React hooks
├── store/                         # Zustand stores
│   ├── cart-store.ts              # Shopping cart
│   └── navigation-store.ts        # Navigation state
│
prisma/
├── schema.prisma                  # Database schema
├── seed.ts                        # Seeding script
└── migrations/                    # Migration history
```

## Database Models (Prisma)

### Core Models
- **User** - Auth users (ADMIN, STAFF, CLIENTE roles)
- **Staff** - Employee profiles (1:1 with User)
- **Customer** - Client profiles (optional User link)
- **Service** - Beauty services catalog
- **Product** - E-commerce products

### Booking System
- **Appointment** - Bookings with deposit ($50 non-refundable)
- **AppointmentService** - Many-to-many services per appointment
- **WorkingHours** - Staff schedules per day

### E-commerce
- **Order** - Product orders
- **OrderItem** - Line items
- **Category** - Shared for services & products

### Config
- **SalonConfig** - Business settings singleton
- **Review** - Service reviews
- **VerificationToken** - Email verification

---

## Common Imports

```typescript
// Database
import { prisma } from "@/lib/prisma"
import { User, Staff, Customer, Service, Appointment } from "@prisma/client"

// Auth
import { auth, signIn, signOut } from "@/lib/auth/auth"
import { UserRole } from "@prisma/client"

// Types & Interfaces
import type {
  ServiceListItem,
  AvailableStaffMember,
  TimeSlot,
  CreateAppointmentData,
  BookingFormProps
} from "@/lib/interfaces"
import type { AppointmentStatus } from "@/lib/types"

// Validation
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  registerSchema,
  loginSchema,
  bookingSchema
} from "@/lib/validations/auth"

// Server Actions
import { revalidatePath } from "next/cache"
import { cache } from "react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Icons (Phosphor)
import {
  Calendar,
  User,
  Clock,
  MapPin,
  Phone,
  Envelope,
  CaretRight,
  Check,
  X
} from "@phosphor-icons/react/dist/ssr"

// Date handling
import { format, addMinutes, parse, isAfter, isBefore } from "date-fns"

// Notifications
import { toast } from "sonner"

// Store
import { useCartStore } from "@/store/cart-store"

// Navigation
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// Email
import { sendAppointmentConfirmationEmail } from "@/lib/email/appointment-confirmation"
import { sendPasswordResetEmail } from "@/lib/email/password-reset"

// Stripe
import { stripe } from "@/lib/stripe"
```

---

## Naming Conventions

### Files
- **Components**: `kebab-case.tsx` (e.g., `booking-form.tsx`)
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Server Actions**: `kebab-case.ts` (e.g., `appointments.ts`)
- **Validations**: `kebab-case.ts` in `/lib/validations/`
- **Email templates**: `kebab-case.ts` in `/lib/email/`

### Code
- **Components**: `PascalCase` (e.g., `BookingForm`)
- **Functions/Variables**: `camelCase` (e.g., `createAppointment`)
- **Server Actions**: `camelCase` (e.g., `createAppointmentAction`)
- **Types/Interfaces**: `PascalCase` (e.g., `AppointmentData`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_BOOKING_ADVANCE`)
- **Zod Schemas**: `camelCase` + `Schema` suffix (e.g., `bookingSchema`)

### Database
- **Models**: `PascalCase` (e.g., `Appointment`)
- **Fields**: `camelCase` (e.g., `startTime`, `depositPaid`)
- **Relations**: Descriptive names (e.g., `staffServices`, `customer`)

---

## Critical Flows

### 1. Appointment Booking Flow

```
Customer selects service → Selects staff member
→ Picks available date/time → Enters customer info
→ Stripe Checkout ($50 deposit) → Webhook confirms payment
→ Appointment created (status: CONFIRMED)
→ Confirmation email sent → Appears in /my-appointments
```

**Key files:**
- `src/components/booking/booking-form.tsx` - Multi-step form
- `src/app/actions/appointments.ts:290-495` - `createAppointment()`
- `src/app/actions/stripe.ts:11-103` - `createCheckoutSession()`
- `src/app/api/webhooks/stripe/route.ts` - Webhook handler

**Two booking modes:**
1. **Service-first**: Customer picks service → then staff
2. **Staff-first**: Customer picks staff → then services they offer

**Employee booking:**
- 20% discount on services
- No deposit required
- Auto-confirmed status

### 2. Stripe Payment Flow

```
createCheckoutSession() → Stripe Checkout page
→ Customer pays $50 deposit → Stripe webhook fires
→ verifyAndCreateAppointment() (fallback) or webhook creates appointment
→ stripePaymentId stored → depositPaid = true
```

**Key files:**
- `src/app/actions/stripe.ts` - All Stripe logic
- `src/lib/stripe.ts` - Stripe client config

**Metadata stored in Stripe session:**
```typescript
metadata: {
  serviceIds: JSON.stringify(data.serviceIds),
  staffId: data.staffId,
  startTime: data.startTime,
  guestName, guestEmail, guestPhone,
  notes, userId, customerName, isEmployee
}
```

### 3. Authentication Flow

```
Register → Email verification token created
→ Verification email sent → User clicks link
→ Email verified → Can now login
→ Login → JWT session created → Role-based access
```

**Key files:**
- `src/lib/auth/auth.ts` - NextAuth config
- `src/app/actions/auth.ts` - Register, forgot/reset password
- `src/lib/validations/auth.ts` - Zod schemas

**Roles:**
- `ADMIN` - Full dashboard access
- `STAFF` - Staff portal access
- `CLIENTE` - Customer portal access

**Session structure:**
```typescript
session.user = {
  id: string,
  email: string,
  name: string,
  role: "ADMIN" | "STAFF" | "CLIENTE",
  image?: string
}
```

### 4. Product Checkout Flow

```
Add to cart (Zustand) → /cart page
→ /checkout → Stripe Checkout (full amount + tax)
→ Webhook creates Order → Order items created
→ Confirmation email → Appears in /my-orders
```

**Key files:**
- `src/store/cart-store.ts` - Cart state (persisted to localStorage)
- `src/app/actions/orders.ts` - Order management

### 5. Appointment Status Lifecycle

```
PENDING (created, unpaid)
  ↓ [deposit paid]
CONFIRMED (paid, upcoming)
  ↓ [appointment time passes]
  ├── COMPLETED (marked by staff/admin)
  ├── NO_SHOW (auto-marked if not attended)
  └── CANCELLED (by customer or admin)
```

**Auto-handling (in `getAdminAppointments`):**
- PENDING + past → CANCELLED + expired email
- CONFIRMED + past → NO_SHOW + notification email

---

## Commands

```bash
# Development
pnpm dev                  # Local dev (Turbopack)
pnpm build                # Production build
pnpm start                # Start production
pnpm lint                 # ESLint
pnpm format               # Prettier

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to DB
pnpm db:migrate           # Run migrations
pnpm db:studio            # Prisma Studio GUI
pnpm db:seed              # Seed database
```

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Rules for Claude

### General Principles
- Review with maximum depth following best practices
- NEVER force unnecessary changes
- Keep code simple and readable
- If something works well, don't change it

### Code Standards
- Always TypeScript, never JavaScript
- Server Components by default
- `"use client"` only when strictly necessary
- Server Actions for mutations (in `/src/app/actions/`)
- Always validate inputs with Zod
- Handle errors with try/catch
- Use Prisma Client from `@prisma/client`

### Styling
- Tailwind CSS for all styling
- shadcn/ui components (Radix UI primitives)
- Phosphor Icons for icons
- Mobile-first approach
- Use `cn()` helper for class merging

### Forms
- React Hook Form + Zod resolver
- Client-side AND server-side validation
- Sonner for toast notifications

### Authentication
- NextAuth v5 with JWT strategy
- Verify session with `auth()` in Server Components
- Role-based route protection in middleware/layouts

### Git
- Descriptive commits in English
- One feature per commit
- DO NOT include AI/Claude mentions in commits
- DO NOT add Co-Authored-By from Claude/Anthropic

### Security
- Never expose sensitive data in client components
- Validate all server action inputs
- Use `auth()` to verify permissions
- Escape user input to prevent XSS
- Use parameterized queries (Prisma handles this)

---

## Important Notes

- **React Compiler enabled**: Manual `memo()`, `useMemo()`, `useCallback()` usually unnecessary
- **Decimal handling**: Prisma returns `Decimal` for prices - always convert with `.toNumber()`
- **Date serialization**: Server Actions serialize Date to string - always `new Date(date)` on receive
- **Image storage**: Cloudinary for images, store public IDs in database
- **Email**: All emails async to not block response
- **Deposit**: $50 non-refundable via Stripe, configurable in SalonConfig

---

*Last updated: January 2025*
