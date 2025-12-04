import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { StaffForm } from "@/components/dashboard/staff-form"
import { getActiveServicesForStaff, createStaffMember } from "@/app/actions/staff"
import type { StaffFormData } from "@/lib/validations/staff"

export default async function NewStaffPage() {
  const services = await getActiveServicesForStaff()

  async function handleCreate(data: StaffFormData) {
    "use server"
    return await createStaffMember(data)
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
          <h1 className="text-3xl font-bold">New Staff Member</h1>
          <p className="text-muted-foreground">
            Add a new team member
          </p>
        </div>
      </div>

      {/* Form */}
      <StaffForm
        services={services}
        mode="create"
        onSubmit={handleCreate}
      />
    </div>
  )
}
