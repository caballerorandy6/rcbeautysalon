import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeftIcon, ImageIcon, TrashIcon } from "@/components/icons"

// Mockup data - will be replaced with real data
const service = {
  id: "1",
  name: "Haircut & Styling",
  slug: "haircut-styling",
  description: "Professional haircut and styling service. Includes consultation, wash, cut, and styling. Our expert stylists will help you achieve your desired look.",
  duration: 60,
  price: 85.00,
  category: "hair",
  image: null,
  isActive: true,
  isFeatured: true,
  staff: ["Emma Wilson", "Sarah Miller"],
}

export default function EditServicePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/services">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">
              {service.name}
            </p>
          </div>
        </div>
        <Button variant="destructive">
          <TrashIcon size={16} className="mr-2" />
          Delete Service
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>Basic details about the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" defaultValue={service.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" defaultValue={service.slug} />
                <p className="text-xs text-muted-foreground">
                  This will be used in the service URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={service.description}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" defaultValue={service.duration} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" defaultValue={service.price} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  defaultValue={service.category}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a category</option>
                  <option value="hair">Hair</option>
                  <option value="nails">Nails</option>
                  <option value="skin">Skin Care</option>
                  <option value="body">Body</option>
                  <option value="makeup">Makeup</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Service Image</CardTitle>
              <CardDescription>Upload an image for the service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <ImageIcon size={48} className="text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop an image, or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Service is available for booking
                  </p>
                </div>
                <Switch defaultChecked={service.isActive} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Show on landing page
                  </p>
                </div>
                <Switch defaultChecked={service.isFeatured} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff</CardTitle>
              <CardDescription>Assign staff who can perform this service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Emma Wilson", "Sarah Miller", "Maria Garcia", "Carlos Ruiz"].map((staff) => (
                  <label key={staff} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      defaultChecked={service.staff.includes(staff)}
                    />
                    <span className="text-sm">{staff}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button className="w-full">Save Changes</Button>
            <Link href="/dashboard/services">
              <Button variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
