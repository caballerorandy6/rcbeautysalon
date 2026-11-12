# Beauty Salon Management System

**Full-stack platform for a beauty salon** — online booking with a Stripe deposit, product shop, customer accounts, staff portal and an admin dashboard with analytics.

**Live demo:** [rcbeautysalon.vercel.app](https://rcbeautysalon.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38b2ac?logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-635bff?logo=stripe&logoColor=white)

## What it does

Three roles — **admin**, **staff** and **client** — each with its own area.

### Public site and booking
- Services with detail pages, galleries, FAQs and reviews; staff profiles.
- **Booking:** the client picks services, stylist, date and time from the available slots, and pays a deposit with Stripe Checkout (default $50, set in the salon settings; staff get 20% off).
- Emails for every step of an appointment: confirmation, reminder, reschedule, cancellation, completion, no-show and expiration.

### Shop
- Product catalog, cart and Stripe checkout; order history for the client.
- Product images uploaded to Cloudinary.

### Client account
- Register with email verification, log in, reset password.
- My appointments, my orders, my reviews and notification preferences.

### Staff portal
- Own appointments, working schedule and profile.

### Admin dashboard
- Appointments (including creating them manually), services, products, orders, staff and users.
- Analytics with revenue and top-services charts (Tremor).
- Salon settings: business details, booking deposit and more.

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, React Compiler), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Radix), Phosphor icons, Tremor charts, react-day-picker |
| Data | PostgreSQL, Prisma 6 |
| Auth | NextAuth v5 (credentials, email verification, roles) with Prisma adapter |
| Payments | Stripe Checkout and webhooks |
| Email | Resend, React Email |
| Media | Cloudinary |
| Forms and state | React Hook Form, Zod, Zustand (cart) |
| Tooling | pnpm, Prettier, Docker Compose (local PostgreSQL) |
| Hosting | Vercel |

## Project structure

```
src/app/
  (public)/     home, services, staff, booking result pages
  (auth)/       login, register, verify email, forgot and reset password
  (customer)/   booking, shop, cart, checkout, my account, appointments, orders, reviews
  (staff)/      staff portal: appointments, schedule, profile
  (admin)/      dashboard: analytics, appointments, services, products, orders, staff, users, settings
  api/          auth, Stripe webhook, image upload
  actions/      server actions
src/lib/        auth, email templates, Prisma client, utilities
prisma/         schema and seed
```

## Getting started

**Requirements:** Node.js 20.9+, pnpm and Docker (or your own PostgreSQL).

```bash
git clone https://github.com/caballerorandy6/rcbeautysalon.git
cd rcbeautysalon
pnpm install
docker compose up -d        # local PostgreSQL
# create .env with the variables below
pnpm db:migrate             # create the database tables
pnpm db:seed                # optional sample data
pnpm dev                    # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret |
| `NEXT_PUBLIC_APP_URL` | App URL, e.g. `http://localhost:3000` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payments |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Emails |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm build` | Generate the Prisma client and build |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm db:migrate` | Create and apply a migration |
| `pnpm db:seed` | Seed the database |
| `pnpm db:studio` | Open Prisma Studio |

## Author

**Randy Caballero** — Full-Stack Developer, Houston, TX
[rcweb.dev](https://rcweb.dev) · [LinkedIn](https://linkedin.com/in/caballerorandy) · [GitHub](https://github.com/caballerorandy6)
