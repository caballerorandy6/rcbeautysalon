import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { StaffForm } from "@/components/dashboard/staff-form"
import {
  getStaffMemberById,
  getActiveServicesForStaff,
  updateStaffMember,
  deleteStaffMember,
} from "@/app/actions/staff"
import type { StaffFormData } from "@/lib/validations/staff"

interface EditStaffPageProps {
  params: Promise<{ id: string }>
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params

  // Fetch staff member and services in parallel
  const [staff, services] = await Promise.all([
    getStaffMemberById(id),
    getActiveServicesForStaff(),
  ])

  if (!staff) {
    notFound()
  }

  async function handleUpdate(data: StaffFormData) {
    "use server"
    return await updateStaffMember(id, data)
  }

  async function handleDelete() {
    "use server"
    return await deleteStaffMember(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Staff Member</h1>
          <p className="text-muted-foreground">{staff.name}</p>
        </div>
      </div>

      {/* Form */}
      <StaffForm
        services={services}
        staff={staff}
        mode="edit"
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
