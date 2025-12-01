import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ScissorsIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const services = [
  { id: "1", name: "Haircut & Styling", category: "Hair", duration: 60, price: 85.00, image: "/images/services/haircut.jpg", isActive: true, isFeatured: true },
  { id: "2", name: "Hair Coloring", category: "Hair", duration: 120, price: 150.00, image: "/images/services/coloring.jpg", isActive: true, isFeatured: true },
  { id: "3", name: "Manicure", category: "Nails", duration: 45, price: 35.00, image: "/images/services/manicure.jpg", isActive: true, isFeatured: false },
  { id: "4", name: "Pedicure", category: "Nails", duration: 60, price: 45.00, image: "/images/services/pedicure.jpg", isActive: true, isFeatured: false },
  { id: "5", name: "Facial Treatment", category: "Skin", duration: 90, price: 95.00, image: "/images/services/facial.jpg", isActive: true, isFeatured: true },
  { id: "6", name: "Massage Therapy", category: "Body", duration: 60, price: 80.00, image: "/images/services/massage.jpg", isActive: false, isFeatured: false },
]

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your salon services
          </p>
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
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-3xl text-green-600">20</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Featured</CardDescription>
            <CardTitle className="text-3xl text-blue-600">6</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <div className="flex h-full items-center justify-center">
                <ScissorsIcon size={48} className="text-muted-foreground/50" />
              </div>
              {service.isFeatured && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Featured
                </span>
              )}
              {!service.isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    Inactive
                  </span>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.category}</CardDescription>
                </div>
                <p className="text-xl font-bold">${service.price.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {service.duration} minutes
                </p>
                <div className="flex gap-1">
                  <Link href={`/dashboard/services/${service.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <PencilIcon size={16} />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <TrashIcon size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
