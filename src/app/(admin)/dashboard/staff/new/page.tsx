import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeftIcon, ImageIcon } from "@/components/icons"

const daysOfWeek = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
]

export default function NewStaffPage() {
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
                <Input id="name" placeholder="e.g., Emma Wilson" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="emma@salon.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description about the staff member..."
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
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center gap-4">
                    <div className="w-28">
                      <Label>{day.name}</Label>
                    </div>
                    <Switch />
                    <div className="flex flex-1 items-center gap-2">
                      <Input type="time" defaultValue="09:00" className="w-32" />
                      <span className="text-muted-foreground">to</span>
                      <Input type="time" defaultValue="17:00" className="w-32" />
                    </div>
                  </div>
                ))}
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
                <Switch defaultChecked />
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
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button className="w-full">Create Staff Member</Button>
            <Link href="/dashboard/staff">
              <Button variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
