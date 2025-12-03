import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { ServiceForm } from "@/components/dashboard/service-form"
import { getAllCategories, getAllActiveStaff } from "@/app/actions/services"

export default async function NewServicePage() {
  const [categories, staff] = await Promise.all([
    getAllCategories(),
    getAllActiveStaff(),
  ])

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
          <h1 className="text-3xl font-bold">New Service</h1>
          <p className="text-muted-foreground">Create a new salon service</p>
        </div>
      </div>

      {/* Form */}
      <ServiceForm categories={categories} staff={staff} />
    </div>
  )
}
