import type { Metadata } from "next"
import { Rouge_Script, Poppins } from "next/font/google"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Toaster } from "sonner"
import "./globals.css"

const rougeScript = Rouge_Script({
  variable: "--font-rouge-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "BS Beauty Salon - Professional Beauty Services",
  description: "Book appointments, shop products, and manage your beauty salon experience",
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${rougeScript.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}

            {/* Footer - Appears on ALL pages (public, customer, admin) */}
            <footer className="relative overflow-hidden border-t border-primary/10 bg-linear-to-b from-muted/30 via-muted/50 to-muted/30 py-16">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

              <div className="container relative mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                  {/* Brand Section */}
                  <div className="space-y-4 lg:col-span-1">
                    <Link href="/" className="inline-block -mt-8">
                      <Logo size={200} className="transition-transform duration-300 hover:scale-105" />
                    </Link>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Your premier destination for beauty and wellness services.
                      Transform your look with our expert team.
                    </p>
                    {/* Social Links */}
                    <div className="flex gap-3 pt-2">
                      {/* Facebook */}
                      <a
                        href="#"
                        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2]/10 backdrop-blur-sm border border-[#1877F2]/30 transition-all duration-500 ease-out hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/40 hover:-translate-y-1 hover:scale-110"
                        aria-label="Facebook"
                      >
                        <svg className="h-5 w-5 fill-[#1877F2] transition-colors duration-500 ease-out group-hover:fill-white" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                        </svg>
                      </a>

                      {/* Instagram */}
                      <a
                        href="#"
                        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 backdrop-blur-sm border border-[#E4405F]/30 transition-all duration-500 ease-out hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#515BD4] hover:border-transparent hover:shadow-lg hover:shadow-[#E4405F]/40 hover:-translate-y-1 hover:scale-110"
                        aria-label="Instagram"
                      >
                        <svg className="h-5 w-5 transition-all duration-500 ease-out" viewBox="0 0 24 24">
                          <defs>
                            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: '#F58529' }} />
                              <stop offset="50%" style={{ stopColor: '#DD2A7B' }} />
                              <stop offset="100%" style={{ stopColor: '#515BD4' }} />
                            </linearGradient>
                          </defs>
                          <path className="fill-[url(#instagram-gradient)] group-hover:fill-white transition-all duration-500 ease-out" d="M16 3H8C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5zm3 13c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h8c1.654 0 3 1.346 3 3v8z"/>
                          <circle className="fill-[url(#instagram-gradient)] group-hover:fill-white transition-all duration-500 ease-out" cx="12" cy="12" r="3"/>
                          <circle className="fill-[url(#instagram-gradient)] group-hover:fill-white transition-all duration-500 ease-out" cx="17.5" cy="6.5" r=".5"/>
                        </svg>
                      </a>

                      {/* Twitter */}
                      <a
                        href="#"
                        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1DA1F2]/10 backdrop-blur-sm border border-[#1DA1F2]/30 transition-all duration-500 ease-out hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:shadow-lg hover:shadow-[#1DA1F2]/40 hover:-translate-y-1 hover:scale-110"
                        aria-label="Twitter"
                      >
                        <svg className="h-5 w-5 fill-[#1DA1F2] transition-colors duration-500 ease-out group-hover:fill-white" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold tracking-tight">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <Link
                          href="/services"
                          className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="mr-2 text-accent transition-transform group-hover:translate-x-1">→</span>
                          Services
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/shop"
                          className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="mr-2 text-accent transition-transform group-hover:translate-x-1">→</span>
                          Shop
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/booking"
                          className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="mr-2 text-accent transition-transform group-hover:translate-x-1">→</span>
                          Book Appointment
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/my-appointments"
                          className="group inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span className="mr-2 text-accent transition-transform group-hover:translate-x-1">→</span>
                          My Appointments
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold tracking-tight">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>123 Beauty Street<br/>New York, NY 10001</span>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent">
                        <svg className="h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <a href="mailto:contact@beautysalon.com">contact@beautysalon.com</a>
                      </li>
                      <li className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent">
                        <svg className="h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <a href="tel:+15551234567">(555) 123-4567</a>
                      </li>
                    </ul>
                  </div>

                  {/* Business Hours */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-bold tracking-tight">Business Hours</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium text-foreground">9am - 8pm</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Saturday</span>
                        <span className="font-medium text-foreground">10am - 6pm</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Sunday</span>
                        <span className="font-medium text-accent">Closed</span>
                      </li>
                    </ul>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs font-medium text-primary">
                        ✨ Walk-ins welcome! Book online for guaranteed appointment times.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 md:flex-row">
                  <p className="text-sm text-muted-foreground text-center md:text-left">
                    &copy; {new Date().getFullYear()} <span className="bg-linear-to-r from-accent to-primary bg-clip-text font-semibold text-transparent">RC Web Solutions LLC</span> by Beauty Salon. All rights reserved.
                  </p>
                  <div className="flex gap-6 text-sm">
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                      Privacy Policy
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                      Terms of Service
                    </Link>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                      Cookies
                    </Link>
                  </div>
                </div>
              </div>
            </footer>

            <Toaster position="top-right" richColors />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
