"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageIcon, TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { toast } from "sonner"
import {
  createStaffSchema,
  updateStaffSchema,
  type StaffFormData,
  type WorkingHourFormData,
} from "@/lib/validations/staff"

interface Service {
  id: string
  name: string
}

interface WorkingHour {
  id?: string
  dayOfWeek: number
  isActive: boolean
  startTime: string
  endTime: string
}

interface StaffData {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  image: string | null
  isActive: boolean
  services?: { service: { id: string; name: string } }[]
  workingHours?: WorkingHour[]
}

interface StaffFormProps {
  services: Service[]
  staff?: StaffData
  mode?: "create" | "edit"
  onSubmit: (data: StaffFormData) => Promise<{ success: boolean; error?: string }>
  onDelete?: () => Promise<{ success: boolean; error?: string }>
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

const defaultWorkingHours: WorkingHourFormData[] = daysOfWeek.map((day) => ({
  dayOfWeek: day.id,
  isActive: day.id >= 1 && day.id <= 5, // Mon-Fri active by default
  startTime: "09:00",
  endTime: "17:00",
}))

export function StaffForm({ services, staff, mode = "create", onSubmit, onDelete }: StaffFormProps) {
  const router = useRouter()
  const isEditMode = mode === "edit"
  const [image, setImage] = useState<string | null>(staff?.image || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(
    staff?.services?.map((s) => s.service.id) || []
  )
  const [workingHours, setWorkingHours] = useState<WorkingHourFormData[]>(
    staff?.workingHours?.map((wh) => ({
      dayOfWeek: wh.dayOfWeek,
      isActive: wh.isActive,
      startTime: wh.startTime,
      endTime: wh.endTime,
    })) || defaultWorkingHours
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(isEditMode ? updateStaffSchema : createStaffSchema),
    defaultValues: {
      name: staff?.name || "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      bio: staff?.bio || "",
      isActive: staff?.isActive ?? true,
    },
  })

  const watchIsActive = watch("isActive")

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "staff")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setImage(data.url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Remove image
  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Toggle service selection
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Update working hours
  const updateWorkingHour = (dayOfWeek: number, field: keyof WorkingHourFormData, value: string | boolean) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.dayOfWeek === dayOfWeek ? { ...wh, [field]: value } : wh
      )
    )
  }

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this staff member? This action cannot be undone."
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await onDelete()

      if (result.success) {
        toast.success("Staff member deleted successfully")
        router.push("/dashboard/staff")
      } else {
        toast.error(result.error || "Failed to delete staff member")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  // Submit form
  const handleFormSubmit = async (data: StaffFormData) => {
    try {
      const staffData: StaffFormData = {
        ...data,
        image: image || undefined,
        serviceIds: selectedServices,
        workingHours: workingHours,
      }

      const result = await onSubmit(staffData)

      if (result.success) {
        toast.success(isEditMode ? "Staff member updated successfully" : "Staff member created successfully")
        router.push("/dashboard/staff")
      } else {
        toast.error(result.error || `Failed to ${isEditMode ? "update" : "create"} staff member`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about the staff member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emma Wilson"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="emma@salon.com"
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description about the staff member..."
                  rows={4}
                  {...register("bio")}
                  disabled={isSubmitting}
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
              {image ? (
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={image}
                    alt="Staff photo"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
              ) : (
                <div
                  className={`border-muted-foreground/25 hover:border-muted-foreground/50 mx-auto flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-colors ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <SpinnerIcon size={48} className="text-muted-foreground/50 animate-spin" />
                  ) : (
                    <ImageIcon size={48} className="text-muted-foreground/50" />
                  )}
                  <p className="text-muted-foreground mt-2 text-sm">
                    {isUploading ? "Uploading..." : "Click to upload"}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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
                  const hours = workingHours.find((wh) => wh.dayOfWeek === day.id)
                  return (
                    <div key={day.id} className="flex items-center gap-4">
                      <div className="w-28">
                        <Label>{day.name}</Label>
                      </div>
                      <Switch
                        checked={hours?.isActive || false}
                        onCheckedChange={(checked) =>
                          updateWorkingHour(day.id, "isActive", checked)
                        }
                        disabled={isSubmitting}
                      />
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          type="time"
                          value={hours?.startTime || "09:00"}
                          onChange={(e) =>
                            updateWorkingHour(day.id, "startTime", e.target.value)
                          }
                          className="w-32"
                          disabled={isSubmitting || !hours?.isActive}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={hours?.endTime || "17:00"}
                          onChange={(e) =>
                            updateWorkingHour(day.id, "endTime", e.target.value)
                          }
                          className="w-32"
                          disabled={isSubmitting || !hours?.isActive}
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
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-muted-foreground text-xs">
                    Staff member can receive bookings
                  </p>
                </div>
                <Switch
                  checked={watchIsActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Assign services this staff can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No services available</p>
                ) : (
                  services.map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm">{service.name}</span>
                    </label>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting || isDeleting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon size={16} className="mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update Staff Member" : "Create Staff Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/staff")}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </Button>
            {isEditMode && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <SpinnerIcon size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon size={16} className="mr-2" />
                    Delete Staff Member
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
