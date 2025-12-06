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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageIcon, TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { toast } from "sonner"
import {
  createService,
  updateService,
  deleteService,
} from "@/app/actions/services"
import {
  createServiceSchema,
  updateServiceSchema,
  type ServiceFormData,
} from "@/lib/validations/service"

interface Category {
  id: string
  name: string
}

interface Staff {
  id: string
  name: string
}

interface ServiceData {
  id: string
  name: string
  slug: string
  description: string | null
  duration: number
  price: number
  imageUrl: string | null
  categoryId: string | null
  isActive: boolean
  isFeatured: boolean
  staffServices?: { staffId: string }[]
}

interface ServiceFormProps {
  categories: Category[]
  staff: Staff[]
  service?: ServiceData
  mode?: "create" | "edit"
}

export function ServiceForm({
  categories,
  staff,
  service,
  mode = "create",
}: ServiceFormProps) {
  const router = useRouter()
  const isEditMode = mode === "edit"
  const [imageUrl, setImageUrl] = useState<string | null>(
    service?.imageUrl || null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    service?.staffServices?.map((s) => s.staffId) || []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(
      isEditMode ? updateServiceSchema : createServiceSchema
    ),
    defaultValues: {
      name: service?.name || "",
      slug: service?.slug || "",
      description: service?.description || "",
      duration: service?.duration || undefined,
      price: service?.price || undefined,
      categoryId: service?.categoryId || "",
      isActive: service?.isActive ?? true,
      isFeatured: service?.isFeatured ?? false,
      staffIds: service?.staffServices?.map((s) => s.staffId) || [],
    },
  })

  const watchName = watch("name")
  const watchIsActive = watch("isActive")
  const watchIsFeatured = watch("isFeatured")

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Handle name change and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue("name", name)
    setValue("slug", generateSlug(name))
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "service")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setImageUrl(data.url)
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
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Toggle staff selection
  const handleStaffToggle = (staffId: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    )
  }

  // Handle delete service
  const handleDelete = async () => {
    if (!service?.id) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteService(service.id)

      if (result.success) {
        toast.success("Service deleted successfully")
        router.push("/dashboard/services")
      } else {
        toast.error(result.error || "Failed to delete service")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  // Submit form
  const onSubmit = async (data: ServiceFormData) => {
    try {
      const serviceData = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        duration: data.duration,
        price: data.price,
        imageUrl: imageUrl || undefined,
        categoryId: data.categoryId || undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        staffIds: selectedStaff,
      }

      const result =
        isEditMode && service?.id
          ? await updateService(service.id, serviceData)
          : await createService(serviceData)

      if (result.success) {
        toast.success(
          isEditMode
            ? "Service updated successfully"
            : "Service created successfully"
        )
        router.push("/dashboard/services")
      } else {
        toast.error(
          result.error ||
            `Failed to ${isEditMode ? "update" : "create"} service`
        )
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>Basic details about the service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Haircut & Styling"
                  value={watchName}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  placeholder="e.g., haircut-styling"
                  {...register("slug")}
                  disabled={isSubmitting}
                />
                <p className="text-muted-foreground text-xs">
                  This will be used in the service URL
                </p>
                {errors.slug && (
                  <p className="text-destructive text-sm">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  rows={4}
                  {...register("description")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    {...register("duration", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.duration && (
                    <p className="text-destructive text-sm">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="85.00"
                    {...register("price", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-destructive text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  defaultValue={service?.categoryId || undefined}
                  onValueChange={(value) => setValue("categoryId", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {imageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt="Service preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
              ) : (
                <div
                  className={`border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <SpinnerIcon
                      size={48}
                      className="text-muted-foreground/50 animate-spin"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-muted-foreground/50" />
                  )}
                  {!isUploading && (
                    <p className="text-muted-foreground mt-4 text-sm">
                      Click to upload an image
                    </p>
                  )}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-muted-foreground text-xs">
                    Service is available for booking
                  </p>
                </div>
                <Switch
                  checked={watchIsActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured</Label>
                  <p className="text-muted-foreground text-xs">
                    Show on landing page
                  </p>
                </div>
                <Switch
                  checked={watchIsFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Staff</CardTitle>
              <CardDescription>
                Assign staff who can perform this service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {staff.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No staff available
                  </p>
                ) : (
                  staff.map((member) => (
                    <label
                      key={member.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedStaff.includes(member.id)}
                        onChange={() => handleStaffToggle(member.id)}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm">{member.name}</span>
                    </label>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting && (
                <SpinnerIcon size={16} className="mr-2 animate-spin" />
              )}
              {isEditMode ? "Update Service" : "Create Service"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/services")}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? (
                  <SpinnerIcon size={16} className="animate-spin" />
                ) : (
                  <>
                    <TrashIcon size={16} className="mr-2" />
                    Delete Service
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
