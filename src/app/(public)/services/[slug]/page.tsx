import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  UserIcon,
} from "@/components/icons"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedServices,
} from "@/app/actions/services"
import { ReviewsSection } from "@/components/services/reviews-section"
import { GallerySection } from "@/components/services/gallery-section"
import { FAQSection } from "@/components/services/faq-section"
import { RelatedServicesSection } from "@/components/services/related-services-section"
import { ServiceBreadcrumbs } from "@/components/services/breadcrumbs"
import { ReviewForm } from "@/components/services/review-form"
import { StaffCard } from "@/components/staff/staff-card"
import { auth } from "@/lib/auth/auth"

//type ServiceWithStaff = NonNullable<Awaited<ReturnType<typeof getServiceBySlug>>>

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()

  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Not Found | RC Beauty Salon",
    }
  }

  return {
    title: `${service.name} | RC Beauty Salon`,
    description:
      service.description || `Book ${service.name} at RC Beauty Salon`,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Get the service by slug from the database
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  // If it doesn't exist, show 404
  if (!service) {
    notFound()
  }

  // Get related services by category and user session
  const [relatedServices, session] = await Promise.all([
    getRelatedServices(service.categoryId, service.id),
    auth(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Back Button & Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <Link href="/services">
          <Button variant="ghost" className="hover:bg-primary/10 mb-4">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Services
          </Button>
        </Link>
        <ServiceBreadcrumbs
          items={[
            { label: "Services", href: "/services" },
            ...(service.category
              ? [{ label: service.category.name, href: "/services" }]
              : []),
            { label: service.name },
          ]}
        />
      </div>

      {/* Service Detail */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[600px]">
              {service.imageUrl ? (
                <Image
                  src={
                    service.imageUrl.startsWith("http")
                      ? service.imageUrl
                      : cloudinaryPresets.serviceHero(service.imageUrl)
                  }
                  alt={service.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground text-lg">
                    No image available
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div>
              {/* Category Badge */}
              {service.category && (
                <Badge variant="outline" className="border-primary/50 mb-4">
                  {service.category.name}
                </Badge>
              )}

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                {service.name}
              </h1>

              {/* Description */}
              {service.description && (
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>
              )}

              {/* Service Details Cards */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="text-primary flex items-center gap-2">
                      <CurrencyDollarIcon size={20} />
                      <CardTitle className="text-sm font-medium">
                        Price
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      ${service.price.toString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="text-primary flex items-center gap-2">
                      <ClockIcon size={20} />
                      <CardTitle className="text-sm font-medium">
                        Duration
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{service.duration} min</p>
                  </CardContent>
                </Card>
              </div>

              {/* Staff Section */}
              {service.staffServices && service.staffServices.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <UserIcon size={20} className="text-primary" />
                    Available Staff
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service.staffServices.map((staffService) => (
                      <StaffCard
                        key={staffService.staff.id}
                        staff={staffService.staff}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Book Button */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/booking?service=${service.id}`}
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    className="from-primary to-accent w-full bg-linear-to-r hover:opacity-90"
                  >
                    <CalendarIcon size={20} className="mr-2" />
                    Book This Service
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/5 dark:hover:text-accent w-full sm:w-auto"
                  >
                    Browse More Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="border-primary/30 bg-muted/30 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              What to{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Expect
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="from-primary to-accent mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <CardTitle className="text-lg">Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ll discuss your needs and preferences to ensure the
                    perfect result.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="from-primary to-accent mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <CardTitle className="text-lg">Treatment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Relax while our expert professionals work their magic.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="from-primary to-accent mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Walk out feeling confident and looking your absolute best.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection reviews={service.reviews} />

      {/* Review Form Section - Only for authenticated users */}
      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {session?.user ? (
              <div>
                <h2 className="mb-6 text-3xl font-bold">
                  Leave a{" "}
                  <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                    Review
                  </span>
                </h2>
                <ReviewForm serviceId={service.id} serviceName={service.name} />
              </div>
            ) : (
              <div className="border-primary/20 bg-muted/30 rounded-lg border p-8 text-center">
                <h3 className="mb-2 text-xl font-semibold">
                  Share Your Experience
                </h3>
                <p className="text-muted-foreground mb-4">
                  Please sign in to leave a review for this service
                </p>
                <Link href="/login">
                  <Button variant="default">Sign In to Review</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection gallery={service.gallery} serviceName={service.name} />

      {/* FAQ Section */}
      <FAQSection faqs={service.faqs} />

      {/* Related Services Section */}
      <RelatedServicesSection
        services={relatedServices}
        currentServiceId={service.id}
      />
    </div>
  )
}
