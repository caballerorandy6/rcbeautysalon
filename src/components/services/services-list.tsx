"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarBlank } from "@phosphor-icons/react"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import { ServicesFilter } from "./services-filter"
import { filterServices } from "@/app/actions/services"
import { ServiceFilters, ServicesListProps } from "@/lib/interfaces"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ServicesList({
  initialServices,
  categories,
  staff
}: ServicesListProps) {
  const [services, setServices] = useState(initialServices)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = async (filters: ServiceFilters) => {
    setIsLoading(true)
    try {
      const filtered = await filterServices(filters)
      setServices(filtered)
    } catch (error) {
      console.error("Error filtering services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const serviceCategories = Object.keys(services)

  return (
    <>
      {/* Filters */}
      <ServicesFilter
        categories={categories}
        staff={staff}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      {/* Services Grid */}
      {serviceCategories.length > 0 ? (
        <Tabs defaultValue={serviceCategories[0]} className="w-full">
          {/* Category Tabs - Centered */}
          <div className="mb-12 flex justify-center">
            <TabsList className="bg-muted text-muted-foreground inline-flex h-12 items-center justify-center rounded-lg p-1">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="ring-offset-background focus-visible:ring-ring hover:text-accent data-[state=active]:bg-background data-[state=active]:text-accent inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Services Grid for Each Category */}
          {serviceCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap justify-center gap-6">
                  {services[category].map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="group border-primary/10 relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] overflow-hidden rounded-lg border shadow-sm transition-all duration-500 hover:shadow-xl"
                    >
                      {/* Background Image */}
                      <div className="relative h-[280px] overflow-hidden">
                        {service.imageUrl ? (
                          <Image
                            src={service.imageUrl.startsWith('http') ? service.imageUrl : cloudinaryPresets.serviceCard(service.imageUrl)}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-linear-to-br">
                            <div className="p-4 text-center">
                              <div className="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                                <CalendarBlank size={32} weight="regular" className="text-primary/50" />
                              </div>
                              <span className="text-muted-foreground text-sm font-medium">
                                {service.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Elegant Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20 opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-5">
                          <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="font-heading group-hover:text-accent mb-2 text-lg font-semibold tracking-tight text-white transition-colors duration-300">
                              {service.name}
                            </h3>

                            {service.description && (
                              <p className="mb-3 line-clamp-2 text-xs text-white/70">
                                {service.description}
                              </p>
                            )}

                            <div className="group-hover:text-accent/90 flex items-center justify-between text-sm text-white/90 transition-colors duration-300">
                              <span className="font-medium">
                                ${service.price.toString()}
                              </span>
                              {service.duration && (
                                <span className="group-hover:text-accent/70 text-white/70">
                                  {service.duration} min
                                </span>
                              )}
                            </div>

                            {/* Hover Button */}
                            <div className="mt-3 translate-y-2 transform opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                              <div className="text-accent border-accent/50 inline-flex items-center border-b pb-1 text-xs font-medium">
                                View Details
                                <svg
                                  className="ml-1 h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
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
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            {isLoading ? "Loading services..." : "No services found matching your filters."}
          </p>
        </div>
      )}
    </>
  )
}
