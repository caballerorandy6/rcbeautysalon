import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, ShoppingBag, Sparkles, Clock, Star, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Logo placeholder - replace with actual logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Beauty Salon</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#services" className="text-sm font-medium transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="#shop" className="text-sm font-medium transition-colors hover:text-primary">
              Shop
            </Link>
            <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/booking">
              <Button>Book Now</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Your Beauty,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Our Passion
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Experience luxury beauty services and shop premium products, all in one place.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/tienda">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Clock className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Book your appointment online 24/7. Quick, simple, and secure.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Expert Stylists</CardTitle>
                <CardDescription>
                  Our experienced team is dedicated to making you look and feel amazing.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ShoppingBag className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Premium Products</CardTitle>
                <CardDescription>
                  Shop professional-grade beauty products used by our experts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Services</h2>
            <p className="text-muted-foreground">
              Professional beauty treatments tailored to you
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Haircut & Styling", "Hair Color", "Manicure & Pedicure", "Facial Treatment"].map((service) => (
              <Card key={service} className="overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardHeader>
                  <CardTitle className="text-lg">{service}</CardTitle>
                  <CardDescription>Starting at $50</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/booking">
                    <Button variant="outline" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Look?</h2>
          <p className="mb-8 text-lg opacity-90">
            Book your appointment today and experience the difference
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary">
              Schedule Your Visit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Beauty Salon</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted destination for beauty and wellness.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hair Services</li>
                <li>Nail Services</li>
                <li>Facial Treatments</li>
                <li>Body Treatments</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/booking">Book Appointment</Link></li>
                <li><Link href="/tienda">Shop</Link></li>
                <li><Link href="/login">Account</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>123 Beauty Street</li>
                <li>New York, NY 10001</li>
                <li>info@beautysalon.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Beauty Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
