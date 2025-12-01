import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeftIcon, ImageIcon, TrashIcon } from "@/components/icons"

// Mockup data - will be replaced with real data
const staffMember = {
  id: "1",
  name: "Emma Wilson",
  email: "emma@salon.com",
  phone: "(555) 111-1111",
  bio: "Senior stylist with 10+ years of experience specializing in modern cuts and color techniques. Passionate about helping clients find their perfect look.",
  image: null,
  isActive: true,
  services: ["Haircut & Styling", "Hair Coloring"],
  workingHours: [
    { day: 1, enabled: true, start: "09:00", end: "17:00" },
    { day: 2, enabled: true, start: "09:00", end: "17:00" },
    { day: 3, enabled: true, start: "09:00", end: "17:00" },
    { day: 4, enabled: true, start: "09:00", end: "17:00" },
    { day: 5, enabled: true, start: "09:00", end: "17:00" },
    { day: 6, enabled: true, start: "10:00", end: "15:00" },
    { day: 0, enabled: false, start: "09:00", end: "17:00" },
  ],
}

const daysOfWeek = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
]

export default function EditStaffPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Staff Member</h1>
            <p className="text-muted-foreground">
              {staffMember.name}
            </p>
          </div>
        </div>
        <Button variant="destructive">
          <TrashIcon size={16} className="mr-2" />
          Remove Staff
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about the staff member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={staffMember.name} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={staffMember.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={staffMember.phone} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue={staffMember.bio}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload a professional photo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <ImageIcon size={48} className="text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop an image, or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Upload Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set the weekly schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const hours = staffMember.workingHours.find(h => h.day === day.id)
                  return (
                    <div key={day.id} className="flex items-center gap-4">
                      <div className="w-28">
                        <Label>{day.name}</Label>
                      </div>
                      <Switch defaultChecked={hours?.enabled} />
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          type="time"
                          defaultValue={hours?.start || "09:00"}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          defaultValue={hours?.end || "17:00"}
                          className="w-32"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Staff member can receive bookings
                  </p>
                </div>
                <Switch defaultChecked={staffMember.isActive} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Assign services this staff can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Haircut & Styling",
                  "Hair Coloring",
                  "Manicure",
                  "Pedicure",
                  "Facial Treatment",
                  "Massage Therapy",
                ].map((service) => (
                  <label key={service} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      defaultChecked={staffMember.services.includes(service)}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button className="w-full">Save Changes</Button>
            <Link href="/dashboard/staff">
              <Button variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
