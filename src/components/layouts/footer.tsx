import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const quickLinks = [
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/booking", label: "Book Appointment" },
  { href: "/my-appointments", label: "My Appointments" },
]

const businessHours = [
  { day: "Monday - Friday", hours: "9am - 8pm" },
  { day: "Saturday", hours: "10am - 6pm" },
  { day: "Sunday", hours: "Closed", isClosed: true },
]

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Cookies" },
]

const contactInfo = {
  address: {
    line1: "123 Beauty Street",
    line2: "New York, NY 10001",
  },
  email: "contact@beautysalon.com",
  phone: "(555) 123-4567",
  phoneHref: "+15551234567",
}

const Footer = () => {
  return (
    <footer className="border-primary/10 from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden border-t bg-linear-to-b py-16">
      {/* Decorative gradient overlay */}
      <div className="from-primary/5 to-accent/5 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent" />

      <div className="relative container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo
                variant="footer"
                className="transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your premier destination for beauty and wellness services.
              Transform your look with our expert team.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {/* Facebook */}
              <a
                href="#"
                className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-110 hover:border-[#1877F2] hover:bg-[#1877F2] hover:shadow-lg hover:shadow-[#1877F2]/40"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5 fill-[#1877F2] transition-colors duration-500 ease-out group-hover:fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E4405F]/30 bg-linear-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-110 hover:border-transparent hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#515BD4] hover:shadow-lg hover:shadow-[#E4405F]/40"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5 transition-all duration-500 ease-out"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient
                      id="instagram-gradient"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" style={{ stopColor: "#F58529" }} />
                      <stop offset="50%" style={{ stopColor: "#DD2A7B" }} />
                      <stop offset="100%" style={{ stopColor: "#515BD4" }} />
                    </linearGradient>
                  </defs>
                  <path
                    className="fill-[url(#instagram-gradient)] transition-all duration-500 ease-out group-hover:fill-white"
                    d="M16 3H8C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5zm3 13c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3h8c1.654 0 3 1.346 3 3v8z"
                  />
                  <circle
                    className="fill-[url(#instagram-gradient)] transition-all duration-500 ease-out group-hover:fill-white"
                    cx="12"
                    cy="12"
                    r="3"
                  />
                  <circle
                    className="fill-[url(#instagram-gradient)] transition-all duration-500 ease-out group-hover:fill-white"
                    cx="17.5"
                    cy="6.5"
                    r=".5"
                  />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#1DA1F2]/30 bg-[#1DA1F2]/10 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-110 hover:border-[#1DA1F2] hover:bg-[#1DA1F2] hover:shadow-lg hover:shadow-[#1DA1F2]/40"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5 fill-[#1DA1F2] transition-colors duration-500 ease-out group-hover:fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl tracking-tight md:text-3xl">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-muted-foreground hover:text-primary inline-flex items-center transition-colors"
                  >
                    <span className="text-accent mr-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl tracking-tight md:text-3xl">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground flex items-start gap-3">
                <svg
                  className="text-primary mt-0.5 h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {contactInfo.address.line1}
                  <br />
                  {contactInfo.address.line2}
                </span>
              </li>
              <li className="text-muted-foreground hover:text-accent flex items-center gap-3 transition-colors">
                <svg
                  className="text-primary h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </li>
              <li className="text-muted-foreground hover:text-accent flex items-center gap-3 transition-colors">
                <svg
                  className="text-primary h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href={`tel:${contactInfo.phoneHref}`}>{contactInfo.phone}</a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl tracking-tight md:text-3xl">
              Business Hours
            </h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {businessHours.map((item) => (
                <li
                  key={item.day}
                  className="flex items-center justify-between"
                >
                  <span>{item.day}</span>
                  <span
                    className={`font-medium ${item.isClosed ? "text-accent" : "text-foreground"}`}
                  >
                    {item.hours}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
              <p className="text-primary text-xs font-medium">
                ✨ Walk-ins welcome! Book online for guaranteed appointment
                times.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-primary/10 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="from-accent to-primary bg-linear-to-r bg-clip-text font-semibold text-transparent">
              RC Beauty Salon.
            </span>{" "}
            Developed by RC Web Solutions LLC
          </p>
          <div className="flex gap-6 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
