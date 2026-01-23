import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ScissorsIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
} from "@/components/icons"
import { getAdminServices, getServiceStats } from "@/app/actions/services"
import { formatCurrency } from "@/lib/utils/format"
import { ServiceSearch } from "@/components/dashboard/service-search"

interface ServicesPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams
  const search = params.search || ""

  const [services, stats] = await Promise.all([
    getAdminServices(search),
    getServiceStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Manage{" "}
            <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-muted-foreground">Manage your salon services</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button>
            <PlusIcon size={16} className="mr-2" />
            Add Service
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{stats.totalServices}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.activeServices}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Featured</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {stats.featuredServices}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">{stats.categoriesCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <ServiceSearch initialSearch={search} />

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ScissorsIcon size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {search ? "No services found matching your search" : "No services yet"}
            </p>
            {!search && (
              <Link href="/dashboard/services/new" className="mt-4">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add Your First Service
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ScissorsIcon size={48} className="text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  {service.isFeatured && (
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  {!service.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.category?.name}</CardDescription>
                  </div>
                  <p className="text-primary text-xl font-bold">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground space-y-1 text-sm">
                    <p>{service.duration} minutes</p>
                    <p>
                      {service._count.appointmentServices} bookings •{" "}
                      {service._count.staffServices} staff
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="ghost" size="icon" title="View public page">
                        <EyeIcon size={16} />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/services/${service.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit service">
                        <PencilIcon size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
