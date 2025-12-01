import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  UserCogIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  CalendarIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const staff = [
  { id: "1", name: "Emma Wilson", email: "emma@salon.com", phone: "(555) 111-1111", role: "Senior Stylist", services: 8, appointments: 145, isActive: true },
  { id: "2", name: "Sarah Miller", email: "sarah@salon.com", phone: "(555) 222-2222", role: "Colorist", services: 5, appointments: 98, isActive: true },
  { id: "3", name: "Maria Garcia", email: "maria@salon.com", phone: "(555) 333-3333", role: "Nail Technician", services: 6, appointments: 120, isActive: true },
  { id: "4", name: "Carlos Ruiz", email: "carlos@salon.com", phone: "(555) 444-4444", role: "Barber", services: 4, appointments: 87, isActive: true },
  { id: "5", name: "Jennifer Lee", email: "jennifer@salon.com", phone: "(555) 555-5555", role: "Esthetician", services: 7, appointments: 65, isActive: false },
]

export default function StaffPage() {
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Staff</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">7</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>On Duty Today</CardDescription>
            <CardTitle className="text-3xl text-blue-600">5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Appointments Today</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search staff..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className={!member.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    {!member.isActive && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        Inactive
                      </span>
                    )}
                  </div>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{member.email}</p>
                <p className="text-muted-foreground">{member.phone}</p>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-2xl font-bold">{member.services}</p>
                  <p className="text-muted-foreground">Services</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{member.appointments}</p>
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
                <Button variant="outline" size="sm">
                  <CalendarIcon size={14} className="mr-1" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
