// Application configuration

export const siteConfig = {
  name: "Beauty Salon",
  description: "Your trusted destination for beauty and wellness",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}

export const businessConfig = {
  // Contact Information
  email: "info@beautysalon.com",
  phone: "(555) 123-4567",
  address: {
    street: "123 Beauty Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },

  // Business Hours
  hours: {
    monday: { open: "9:00 AM", close: "7:00 PM" },
    tuesday: { open: "9:00 AM", close: "7:00 PM" },
    wednesday: { open: "9:00 AM", close: "7:00 PM" },
    thursday: { open: "9:00 AM", close: "8:00 PM" },
    friday: { open: "9:00 AM", close: "8:00 PM" },
    saturday: { open: "10:00 AM", close: "6:00 PM" },
    sunday: { open: "11:00 AM", close: "5:00 PM" },
  },

  // Social Media (optional)
  social: {
    instagram: "https://instagram.com/beautysalon",
    facebook: "https://facebook.com/beautysalon",
    twitter: "https://twitter.com/beautysalon",
  },
}

export const bookingConfig = {
  // Booking settings
  depositAmount: 50.0,
  depositRefundable: false,
  minAdvanceHours: 24, // Minimum hours in advance to book
  maxAdvanceDays: 30, // Maximum days in advance to book
  cancellationPolicy:
    "Appointments must be cancelled at least 24 hours in advance. The $50 deposit is non-refundable.",
}

export const stripeConfig = {
  currency: "usd",
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
}
