import Image from "next/image"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import {
  getAllServicesGroupedByCategory,
  getAllCategories,
  getAllActiveStaff
} from "@/app/actions/services"
import { HeroVideo } from "@/components/services/hero-video"
import { ServicesList } from "@/components/services/services-list"
import { Suspense } from "react"
import { ServicesListSkeleton } from "@/components/services/services-list-skeleton"
import { BookingButton } from "@/components/services/booking-button"

export const metadata = {
  title: "Our Services | RC Beauty Salon",
  description: "Explore our full range of professional beauty services",
}

export default async function ServicesPage() {
  // Get all data for services page
  const [servicesByCategory, categories, staff] = await Promise.all([
    getAllServicesGroupedByCategory(),
    getAllCategories(),
    getAllActiveStaff()
  ])

  // Convert Decimal to number for client components
  const servicesForClient = Object.entries(servicesByCategory).reduce<
    Record<string, Array<{
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
    }>>
  >((acc, [categoryName, services]) => {
    acc[categoryName] = services.map(service => ({
      ...service,
      price: service.price.toNumber()
    }))
    return acc
  }, {})

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden bg-black py-16 md:py-24">
        {/* Client Component for Video */}
        <HeroVideo />

        {/* Content */}
        <div className="container relative z-20 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading mb-4 text-5xl tracking-tight text-white sm:text-6xl md:text-7xl">
              Our{" "}
              <span className="from-accent to-primary bg-linear-to-r bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              Discover our complete range of professional beauty treatments
              designed to help you look and feel your best.
            </p>
          </div>
        </div>
      </section>

      {/* Services with Filters */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ServicesListSkeleton />}>
            <ServicesList
              initialServices={servicesForClient}
              categories={categories}
              staff={staff}
            />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-primary/30 relative overflow-hidden border-t border-b py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={cloudinaryPresets.serviceHero("Beauty Salon/services/book-appoiment_vqo5wj")}
            alt="Book appointment background"
            fill
            className="object-cover"
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="font-heading mb-4 text-4xl md:text-5xl lg:text-6xl">
            Ready to Book Your Appointment?
          </h2>
          <p className="mb-8 text-lg opacity-90 md:text-xl">
            Choose your service and get started today
          </p>
          <BookingButton />
        </div>
      </section>
    </div>
  )
}
