import type { Metadata } from "next"
import { getStaffProfile, getStaffAssignedServices } from "@/app/actions/staff"
import { StaffProfileHeader } from "@/components/staff/staff-profile-header"
import { StaffProfileForm } from "@/components/staff/staff-profile-form"
import { StaffServicesAssigned } from "@/components/staff/staff-services-assigned"

export const metadata: Metadata = {
  title: "My Profile | Staff Portal",
  description: "View and edit your profile information",
}

export default async function StaffProfilePage() {
  const [staffProfile, staffServices] = await Promise.all([
    getStaffProfile(),
    getStaffAssignedServices(),
  ])

  const profile = staffProfile.success ? staffProfile.staff ?? null : null

  const services = staffServices.success ? staffServices.services ?? [] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          View and update your profile information
        </p>
      </div>

      {/* Profile Header with Avatar */}
      <StaffProfileHeader profile={profile} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Form */}
        <StaffProfileForm profile={profile} />

        {/* Services Assigned */}
        <StaffServicesAssigned services={services} />
      </div>
    </div>
  )
}
