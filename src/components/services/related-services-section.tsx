"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarBlank, Clock, CurrencyDollar } from "@phosphor-icons/react"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

interface RelatedService {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  duration: number
  imageUrl: string | null
}

interface RelatedServicesSectionProps {
  services: RelatedService[]
  currentServiceId: string
}

export function RelatedServicesSection({
  services,
  currentServiceId,
}: RelatedServicesSectionProps) {
  // Filter out current service and limit to 3
  const relatedServices = services
    .filter((service) => service.id !== currentServiceId)
    .slice(0, 3)

  if (relatedServices.length === 0) {
    return null // Don't show section if no related services
  }

  return (
    <section className="border-t border-primary/30 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              You Might Also{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Like
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore similar services to complete your beauty routine
            </p>
          </div>

          {/* Services Grid */}
          <div className="flex flex-wrap gap-6 justify-center items-stretch">
            {relatedServices.map((service) => (
              <Card
                key={service.id}
                className="border-primary/10 group overflow-hidden transition-all duration-300 hover:shadow-lg w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex flex-col"
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl.startsWith('http') ? service.imageUrl : cloudinaryPresets.serviceCard(service.imageUrl)}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-linear-to-br">
                      <CalendarBlank size={48} weight="regular" className="text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Service Info */}
                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>

                  <div className="flex-1 mb-4">
                    {service.description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CurrencyDollar size={16} weight="regular" />
                      <span className="font-semibold text-foreground">
                        ${service.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} weight="regular" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/services/${service.slug}`}>
                    <Button
                      variant="outline"
                      className="border-primary/50 hover:bg-primary/5 w-full"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
