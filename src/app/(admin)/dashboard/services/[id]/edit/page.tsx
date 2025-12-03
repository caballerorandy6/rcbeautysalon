import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { ServiceForm } from "@/components/dashboard/service-form"
import { getServiceById, getAllCategories, getAllActiveStaff } from "@/app/actions/services"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params

  // Fetch service, categories, and staff in parallel
  const [service, categories, staff] = await Promise.all([
    getServiceById(id),
    getAllCategories(),
    getAllActiveStaff(),
  ])

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground">{service.name}</p>
        </div>
      </div>

      {/* Form */}
      <ServiceForm
        categories={categories}
        staff={staff}
        service={service}
        mode="edit"
      />
    </div>
  )
}
