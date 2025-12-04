"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import { HeroVideo } from "@/components/landing/hero-video"
import { HeroActions } from "@/components/landing/hero-actions"
import { FeatureCards } from "@/components/landing/feature-cards"
import { CTAButton } from "@/components/landing/cta-button"
import { ProductCard } from "@/components/landing/product-card"
import { SectionWrapper } from "@/components/layouts/section-wrapper"
import { useNavigationStore } from "@/store/navigation-store"

interface Service {
  id: string
  name: string
  slug: string
  price: number | { toString: () => string }
  duration: number | null
  imageUrl: string | null
}

interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  category: { name: string } | null
}

interface Staff {
  id: string
  name: string
  bio: string | null
  image: string | null
}

interface HomeContentProps {
  featuredServices: Service[]
  featuredProducts: Product[]
  featuredStaff: Staff[]
}

export function HomeContent({ featuredServices, featuredProducts, featuredStaff }: HomeContentProps) {
  const { setActiveSection } = useNavigationStore()

  // Reset active section when leaving home page
  useEffect(() => {
    return () => setActiveSection("")
  }, [setActiveSection])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <HeroVideo />
        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading mb-6 text-5xl tracking-tight text-white drop-shadow-lg sm:text-7xl md:text-8xl lg:text-9xl">
              Your Beauty,{" "}
              <span className="from-primary via-accent to-primary bg-linear-to-r bg-clip-text text-transparent">
                Our Passion
              </span>
            </h1>
            <p className="mb-8 text-lg font-medium text-white/90 drop-shadow-md md:text-xl">
              Experience luxury beauty services and shop premium products, all in one place.
            </p>
            <HeroActions />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="from-muted/30 to-background border-primary/30 border-t bg-linear-to-b py-16">
        <div className="container mx-auto px-4">
          <FeatureCards />
        </div>
      </section>

      {/* Services Preview */}
      <SectionWrapper id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-4xl md:text-5xl lg:text-6xl">
              Our{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Professional beauty treatments tailored to you
            </p>
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center gap-4">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group border-primary/10 hover:shadow-primary/10 hover:border-primary/30 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] xl:w-[calc(20%-0.8rem)] relative overflow-hidden rounded-lg border shadow-sm transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative h-80 overflow-hidden">
                    {service.imageUrl ? (
                      <Image
                        src={service.imageUrl.startsWith('http') ? service.imageUrl : cloudinaryPresets.serviceCard(service.imageUrl)}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="bg-muted flex h-full w-full items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20 opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                        <h3 className="font-heading group-hover:text-accent mb-2 text-xl font-semibold tracking-tight text-white transition-colors duration-300">
                          {service.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-white/90 transition-colors duration-300">
                          <span className="group-hover:text-accent/90 font-medium">
                            ${service.price.toString()}
                          </span>
                          {service.duration && (
                            <span className="text-white/70 group-hover:text-accent/70 transition-colors">
                              {service.duration} min
                            </span>
                          )}
                        </div>
                        <div className="mt-4 translate-y-2 transform opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="text-accent border-accent/50 hover:border-accent inline-flex items-center border-b-2 pb-1 text-sm font-medium">
                            Book Now
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary hover:text-white">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* About Our Salon */}
      <SectionWrapper id="about" className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[500px]">
              <Image
                src="https://res.cloudinary.com/caballerorandy/image/upload/v1763776103/Beauty%20Salon/services/salon-interior_uxr7ba.avif"
                alt="Beauty Salon Interior"
                fill
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Welcome to{" "}
                <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                  Our Sanctuary
                </span>
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Step into a world where luxury meets expertise. Our modern salon is designed to provide you with the ultimate beauty experience in a relaxing and sophisticated environment.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                With state-of-the-art facilities and a team of passionate professionals, we&apos;re committed to bringing out your natural beauty and helping you feel confident every day.
              </p>
              <div className="mb-8 grid grid-cols-2 gap-6">
                <div className="bg-primary/5 border-primary/20 rounded-lg border p-4 text-center">
                  <div className="text-primary mb-1 text-3xl font-bold">10+</div>
                  <div className="text-muted-foreground text-sm">Years Experience</div>
                </div>
                <div className="bg-primary/5 border-primary/20 rounded-lg border p-4 text-center">
                  <div className="text-primary mb-1 text-3xl font-bold">5K+</div>
                  <div className="text-muted-foreground text-sm">Happy Clients</div>
                </div>
              </div>
              <CTAButton href="/booking" className="from-primary to-primary/90 group bg-linear-to-r text-white shadow-lg hover:opacity-90">
                Book Your Visit
              </CTAButton>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Our Team */}
      <SectionWrapper id="team" className="border-primary/30 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-4xl md:text-5xl lg:text-6xl">
              Meet Our{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Expert professionals dedicated to your beauty
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center gap-6">
              {featuredStaff.map((staff) => (
                <Link
                  key={staff.id}
                  href={`/staff/${staff.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                >
                  <div className="border-primary/10 hover:border-primary/30 overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
                    <div className="relative aspect-3/4 overflow-hidden">
                      {staff.image ? (
                        <Image
                          src={staff.image.startsWith('http') ? staff.image : cloudinaryPresets.staffCard(staff.image)}
                          alt={staff.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="bg-muted flex h-full w-full items-center justify-center">
                          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                            <span className="text-primary text-2xl font-bold">
                              {staff.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold group-hover:text-accent transition-colors">{staff.name}</h3>
                      {staff.bio && (
                        <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{staff.bio}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/staff">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary hover:text-white">
                View All Team
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Featured Products */}
      <SectionWrapper id="shop" className="border-primary/30 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-4xl md:text-5xl lg:text-6xl">
              Shop Our{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Favorites
              </span>
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Premium beauty products used by our professionals
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={`$${product.price.toFixed(2)}`}
                    category={product.category?.name || "Products"}
                    image={product.images?.[0] || null}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary hover:text-white">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Contact Section */}
      <SectionWrapper id="contact" className="border-primary/30 relative overflow-hidden border-t py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/caballerorandy/image/upload/v1763844271/Beauty%20Salon/services/transform_hwvixg.avif"
            alt="Transform Your Look"
            fill
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold drop-shadow-lg md:text-4xl">
            Ready to Transform Your Look?
          </h2>
          <p className="mb-8 text-lg opacity-95 drop-shadow-md md:text-xl">
            Book your appointment today and experience the difference
          </p>
          <CTAButton
            href="/booking"
            className="from-primary to-primary/90 border-accent/30 group border-2 bg-linear-to-r text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            Schedule Your Visit
          </CTAButton>
        </div>
      </SectionWrapper>
    </div>
  )
}
