# Beauty Salon Management System

A modern, full-stack beauty salon management platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## 🌟 Features

- 📅 **Appointment Booking** - Online booking system with $50 non-refundable deposit
- 🛍️ **E-commerce Shop** - Sell beauty products online
- 👥 **Customer Management** - Track customer history and preferences
- 💼 **Staff Management** - Manage stylists, schedules, and services
- 📊 **Admin Dashboard** - Complete business overview and analytics
- 🎨 **Fully Customizable** - Easy branding with logo, colors, and content
- 💳 **Stripe Payments** - Secure payment processing
- 📧 **Automated Notifications** - Email and SMS reminders

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend + React Email
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm

## 📦 Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/beauty_salon"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Generate with: openssl rand -base64 32
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# (Optional) Seed database with sample data
pnpm prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization Guide

### Logo & Branding

#### 1. Add Your Logo
- Place your logo in `public/logo.png`
- Update references in:
  - `src/app/page.tsx` (Homepage)
  - `src/app/(admin)/layout.tsx` (Admin panel)

#### 2. Update Brand Colors
Edit `src/app/globals.css`:

```css
:root {
  --primary: YOUR_PRIMARY_COLOR;
  --secondary: YOUR_SECONDARY_COLOR;
  --accent: YOUR_ACCENT_COLOR;
}
```

#### 3. Business Information
Update these files:
- **Salon Name**: Search for "Beauty Salon" across the project
- **Contact Info**: `src/app/page.tsx` (footer section)
- **Address**: Footer and contact sections

### Content Customization

#### Homepage (`src/app/page.tsx`)
- Hero section headline and description
- Services preview section
- Call-to-action text
- Footer content

#### Service Images
- Add images to `public/services/`
- Update in database or hardcode in components

#### Product Images
- Upload via admin dashboard
- Or add to `public/products/`

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (cliente)/           # Client-facing pages
│   │   ├── booking/         # Appointment booking ($50 deposit)
│   │   ├── tienda/          # Shop
│   │   └── mis-citas/       # My appointments
│   ├── (admin)/             # Admin dashboard
│   │   ├── dashboard/       # Overview
│   │   ├── citas/           # Appointments management
│   │   ├── productos/       # Products management
│   │   ├── servicios/       # Services management
│   │   ├── usuarios/        # Customers management
│   │   ├── staff/           # Staff management
│   │   └── configuracion/   # Settings
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   └── webhooks/
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── booking/             # Booking components
│   ├── shop/                # Shop components
│   └── layouts/             # Shared layouts
├── lib/
│   ├── db/                  # Database utilities
│   ├── auth/                # NextAuth configuration
│   ├── stripe/              # Stripe integration
│   ├── email/               # Email templates
│   ├── utils/               # Utilities (cn, formatters)
│   └── validations/         # Zod schemas
├── server/
│   ├── actions/             # Server Actions
│   └── queries/             # Data fetching
├── hooks/                   # Custom React hooks
├── store/                   # Zustand stores
└── types/                   # TypeScript types
```

## 💡 Key Features

### Booking System
- **$50 Non-Refundable Deposit** clearly displayed
- Real-time availability checking
- Service and staff selection
- Stripe payment integration
- Automated email confirmations

### E-Commerce Shop
- Product catalog with images
- Shopping cart (Zustand)
- Stripe checkout
- Order management
- Inventory tracking

### Admin Dashboard
- Revenue metrics
- Appointment calendar
- Customer database
- Product management
- Staff scheduling
- Settings and configuration

## 🗄️ Database Schema

Key models in `prisma/schema.prisma`:

- `User` - Authentication
- `SalonConfig` - Branding & settings
- `Customer` - Client profiles
- `Staff` - Team members
- `Service` - Beauty services
- `Appointment` - Bookings ($50 deposit)
- `Product` - Shop inventory
- `Order` - E-commerce orders

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Options
- **Supabase** (recommended)
- **Neon**
- **Railway**
- **PlanetScale**

### Stripe Webhooks
Set webhook endpoint to: `https://yourdomain.com/api/webhooks/stripe`

Events to listen for:
- `checkout.session.completed`
- `payment_intent.succeeded`

## 🔐 Authentication

Uses NextAuth.js v5 with:
- Email/Password (credentials)
- Social providers (optional)
- Role-based access (ADMIN, STAFF, CLIENTE)

## 💳 Payment Flow

1. Customer books appointment
2. Selects service, staff, date/time
3. Pays $50 non-refundable deposit via Stripe
4. Receives confirmation email
5. Appointment created in database

## 📧 Notifications

- **Email**: Resend + React Email templates
- **SMS**: Twilio (optional)
- **Triggers**:
  - Booking confirmation
  - 24h appointment reminder
  - Order confirmation

## 🛠️ Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format

# Prisma Studio (database GUI)
pnpm prisma studio
```

## 📝 Todo (Implementation)

UI is complete. You need to implement:

1. **Server Actions** (`src/server/actions/`)
   - Authentication logic
   - Booking creation
   - Payment processing
   - CRUD operations

2. **API Routes** (`src/app/api/`)
   - Stripe webhook handler
   - NextAuth configuration

3. **Database Queries** (`src/server/queries/`)
   - Data fetching functions
   - Availability checking

4. **Zustand Stores** (`src/store/`)
   - Shopping cart
   - UI state

5. **Email Templates** (`src/lib/email/templates/`)
   - Booking confirmation
   - Reminders
   - Order receipts

## 🤝 Support

For questions: [your-email@example.com]

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js 16, React 19, and Tailwind CSS v4
