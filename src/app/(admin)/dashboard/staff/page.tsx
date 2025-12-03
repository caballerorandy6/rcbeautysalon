import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusIcon,
  PencilIcon,
  CalendarIcon,
} from "@/components/icons"
import { getAdminStaffMembers, getAdminStaffStats } from "@/app/actions/staff"
import { StaffSearch } from "@/components/dashboard/staff-search"

interface StaffPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function StaffPage({ searchParams }: StaffPageProps) {
  const { search } = await searchParams
  const [staffMembers, stats] = await Promise.all([
    getAdminStaffMembers(search),
    getAdminStaffStats(),
  ])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-muted-foreground">
            Manage your team members
          </p>
        </div>
        <Link href="/dashboard/staff/new">
          <Button>
            <PlusIcon size={16} className="mr-2" />
            Add Staff Member
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Staff</CardDescription>
            <CardTitle className="text-3xl">{stats.totalStaff}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.activeStaff}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-muted-foreground">{stats.inactiveStaff}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <StaffSearch />

      {/* Staff Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staffMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No staff members found.</p>
            <Link href="/dashboard/staff/new" className="mt-4 inline-block">
              <Button>
                <PlusIcon size={16} className="mr-2" />
                Add First Staff Member
              </Button>
            </Link>
          </div>
        ) : (
          staffMembers.map((member) => (
            <Card key={member.id} className={!member.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {member.image ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      {!member.isActive && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      {member.bio ? member.bio.substring(0, 50) + (member.bio.length > 50 ? "..." : "") : "No bio"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">{member.email || "No email"}</p>
                  <p className="text-muted-foreground">{member.phone || "No phone"}</p>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-2xl font-bold">{member._count.services}</p>
                    <p className="text-muted-foreground">Services</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{member._count.appointments}</p>
                    <p className="text-muted-foreground">Appointments</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/staff/${member.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <PencilIcon size={14} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/staff/${member.id}/schedule`}>
                    <Button variant="outline" size="sm">
                      <CalendarIcon size={14} className="mr-1" />
                      Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
