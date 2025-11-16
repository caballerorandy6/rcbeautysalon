# 📋 Guía de Implementación - Beauty Salon System

Esta guía te llevará paso a paso desde el setup inicial hasta tener un sistema completamente funcional.

---

## 🎯 FASE 1: Setup Inicial y Base de Datos

### Paso 1.1: Configurar Variables de Entorno
**Archivo:** `.env`

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
# Ejemplo con Supabase:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[GENERAR CON: openssl rand -base64 32]"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (Email)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="onboarding@resend.dev"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Dónde conseguir las keys:**
- PostgreSQL: Supabase.com (gratis) o Neon.tech
- Stripe: dashboard.stripe.com/test/apikeys
- Resend: resend.com/api-keys

---

### Paso 1.2: Inicializar Base de Datos

```bash
# Generar Prisma Client
pnpm db:generate

# Crear migración inicial
pnpm db:migrate

# Verificar con Prisma Studio
pnpm db:studio
```

**Verificación:** Debes ver las tablas creadas en Prisma Studio (User, Customer, Staff, Service, Product, etc.)

---

### Paso 1.3: Crear Datos de Prueba (Seed)

**Archivo:** `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Crear configuración del salón
  await prisma.salonConfig.upsert({
    where: { id: 'salon_config' },
    update: {},
    create: {
      id: 'salon_config',
      name: 'Beauty Salon',
      email: 'info@beautysalon.com',
      phone: '(555) 123-4567',
      address: '123 Beauty Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
  })

  // 2. Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@beautysalon.com' },
    update: {},
    create: {
      email: 'admin@beautysalon.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 3. Crear categorías
  const hairCategory = await prisma.category.create({
    data: { name: 'Hair Services', slug: 'hair-services' },
  })

  const nailCategory = await prisma.category.create({
    data: { name: 'Nail Services', slug: 'nail-services' },
  })

  // 4. Crear servicios
  await prisma.service.createMany({
    data: [
      {
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling',
        duration: 60,
        price: 50,
        categoryId: hairCategory.id,
      },
      {
        name: 'Hair Color',
        description: 'Full hair coloring service',
        duration: 120,
        price: 120,
        categoryId: hairCategory.id,
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Complete nail care',
        duration: 90,
        price: 75,
        categoryId: nailCategory.id,
      },
    ],
  })

  // 5. Crear staff
  const staff1 = await prisma.staff.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@beautysalon.com',
      phone: '(555) 111-2222',
      bio: 'Expert hair stylist with 10+ years experience',
    },
  })

  const staff2 = await prisma.staff.create({
    data: {
      name: 'Michael Brown',
      email: 'michael@beautysalon.com',
      phone: '(555) 333-4444',
      bio: 'Certified color specialist',
    },
  })

  // 6. Crear horarios de trabajo
  const daysOfWeek = [1, 2, 3, 4, 5] // Lun-Vie
  for (const day of daysOfWeek) {
    await prisma.workingHours.create({
      data: {
        staffId: staff1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
      },
    })
  }

  // 7. Crear productos de prueba
  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Shampoo',
        description: 'Professional grade shampoo',
        price: 29.99,
        sku: 'SHMP-001',
        stockQuantity: 50,
        isFeatured: true,
      },
      {
        name: 'Hair Conditioner',
        description: 'Moisturizing conditioner',
        price: 24.99,
        sku: 'COND-001',
        stockQuantity: 45,
      },
    ],
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Ejecutar:**
```bash
pnpm db:seed
```

---

## 🔐 FASE 2: Autenticación (NextAuth)

### Paso 2.1: Configurar NextAuth

**Archivo:** `src/lib/auth/auth.ts`

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
}
```

---

### Paso 2.2: API Route de NextAuth

**Archivo:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

---

### Paso 2.3: Conectar Login Form

**Archivo:** `src/app/(auth)/login/page.tsx` (actualizar)

```typescript
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
// ... resto de imports

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... UI code con form onSubmit={handleSubmit}
  )
}
```

---

## 💳 FASE 3: Sistema de Pagos (Stripe)

### Paso 3.1: Configurar Stripe

**Archivo:** `src/lib/stripe/client.ts`

```typescript
import { loadStripe } from "@stripe/stripe-js"

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}
```

**Archivo:** `src/lib/stripe/server.ts`

```typescript
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})
```

---

### Paso 3.2: Server Action para Crear Checkout

**Archivo:** `src/server/actions/booking.ts`

```typescript
"use server"

import { stripe } from "@/lib/stripe/server"
import prisma from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

export async function createBookingCheckout(data: {
  serviceId: string
  staffId: string
  startTime: Date
  endTime: Date
  customerName: string
  customerEmail: string
  customerPhone: string
}) {
  try {
    // 1. Verificar disponibilidad
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        staffId: data.staffId,
        startTime: {
          lte: data.endTime,
        },
        endTime: {
          gte: data.startTime,
        },
        status: {
          not: "CANCELLED",
        },
      },
    })

    if (existingBooking) {
      throw new Error("Time slot not available")
    }

    // 2. Obtener servicio
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    })

    if (!service) {
      throw new Error("Service not found")
    }

    // 3. Crear Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking Deposit - ${service.name}`,
              description: "Non-refundable booking deposit",
            },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking`,
      metadata: {
        serviceId: data.serviceId,
        staffId: data.staffId,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error("Booking checkout error:", error)
    throw new Error("Failed to create checkout session")
  }
}
```

---

### Paso 3.3: Webhook de Stripe

**Archivo:** `src/app/api/webhooks/stripe/route.ts`

```typescript
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"
import prisma from "@/lib/db/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    // Crear la cita en la base de datos
    const metadata = session.metadata!

    await prisma.appointment.create({
      data: {
        staffId: metadata.staffId,
        startTime: new Date(metadata.startTime),
        endTime: new Date(metadata.endTime),
        guestName: metadata.customerName,
        guestEmail: metadata.customerEmail,
        guestPhone: metadata.customerPhone,
        totalPrice: 50,
        depositAmount: 50,
        depositPaid: true,
        stripePaymentId: session.payment_intent as string,
        status: "CONFIRMED",
        services: {
          create: {
            serviceId: metadata.serviceId,
          },
        },
      },
    })

    // TODO: Enviar email de confirmación
  }

  return NextResponse.json({ received: true })
}
```

---

## 📧 FASE 4: Sistema de Notificaciones

### Paso 4.1: Email Templates

**Archivo:** `src/lib/email/templates/booking-confirmation.tsx`

```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  customerName: string
  serviceName: string
  date: string
  time: string
  staffName: string
}

export default function BookingConfirmationEmail({
  customerName,
  serviceName,
  date,
  time,
  staffName,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your appointment is confirmed!</Preview>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>Appointment Confirmed!</Heading>
          <Text>Hi {customerName},</Text>
          <Text>
            Your appointment has been confirmed for {serviceName} with {staffName}.
          </Text>
          <Text>
            <strong>Date:</strong> {date}
            <br />
            <strong>Time:</strong> {time}
          </Text>
          <Text>
            We've charged a non-refundable deposit of $50.00 to secure your appointment.
          </Text>
          <Text>See you soon!</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

---

### Paso 4.2: Función para Enviar Emails

**Archivo:** `src/lib/email/send.ts`

```typescript
import { Resend } from "resend"
import BookingConfirmationEmail from "./templates/booking-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(data: {
  to: string
  customerName: string
  serviceName: string
  date: string
  time: string
  staffName: string
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: data.to,
    subject: "Your Appointment is Confirmed!",
    react: BookingConfirmationEmail({
      customerName: data.customerName,
      serviceName: data.serviceName,
      date: data.date,
      time: data.time,
      staffName: data.staffName,
    }),
  })
}
```

---

## 🛍️ FASE 5: Tienda Online (Carrito)

### Paso 5.1: Zustand Store para Carrito

**Archivo:** `src/store/cart-store.ts`

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          )

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
```

---

## 🎨 FASE 6: Personalización y Deploy

### Paso 6.1: Personalizar Branding
- Agregar logo en `public/logo.png`
- Actualizar colores en `src/app/globals.css`
- Modificar textos en `src/lib/config.ts`

### Paso 6.2: Deploy en Vercel
```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel dashboard
# Configurar webhook de Stripe apuntando a tu dominio
```

---

## ✅ Checklist Final

- [ ] Base de datos configurada y con seed
- [ ] Login funcional
- [ ] Booking con pago de $50
- [ ] Webhook de Stripe recibiendo eventos
- [ ] Emails de confirmación enviándose
- [ ] Tienda con carrito funcional
- [ ] Panel admin protegido
- [ ] Deploy en producción

---

¡Cuando completes cada fase, avísame para marcarlo como completado! 🚀
