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
import { ImageIcon, TrashIcon, PlusIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { toast } from "sonner"
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products"
import {
  createProductSchema,
  updateProductSchema,
  type ProductFormData,
} from "@/lib/validations/product"

interface Category {
  id: string
  name: string
}

interface ProductData {
  id: string
  name: string
  description: string | null
  price: number
  compareAtPrice: number | null
  sku: string | null
  trackInventory: boolean
  stockQuantity: number
  images: string[]
  categoryId: string | null
  isActive: boolean
  isFeatured: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: ProductData
  mode?: "create" | "edit"
}

export function ProductForm({ categories, product, mode = "create" }: ProductFormProps) {
  const router = useRouter()
  const isEditMode = mode === "edit"
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(isEditMode ? updateProductSchema : createProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || undefined,
      compareAtPrice: product?.compareAtPrice || undefined,
      sku: product?.sku || "",
      trackInventory: product?.trackInventory ?? true,
      stockQuantity: product?.stockQuantity || 0,
      categoryId: product?.categoryId || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
    },
  })

  const watchIsActive = watch("isActive")
  const watchIsFeatured = watch("isFeatured")
  const watchTrackInventory = watch("trackInventory")

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
      formData.append("type", "product")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setImages((prev) => [...prev, data.url])
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
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle delete product
  const handleDelete = async () => {
    if (!product?.id) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    )

    if (!confirmed) return

    setIsDeleting(true)
    try {
      const result = await deleteProduct(product.id)

      if (result.success) {
        toast.success("Product deleted successfully")
        router.push("/dashboard/products")
      } else {
        toast.error(result.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  // Submit form
  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        compareAtPrice: data.compareAtPrice || undefined,
        sku: data.sku || undefined,
        trackInventory: data.trackInventory,
        stockQuantity: data.stockQuantity || 0,
        images: images,
        categoryId: data.categoryId || undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      }

      const result = isEditMode && product?.id
        ? await updateProduct(product.id, productData)
        : await createProduct(productData)

      if (result.success) {
        toast.success(isEditMode ? "Product updated successfully" : "Product created successfully")
        router.push("/dashboard/products")
      } else {
        toast.error(result.error || `Failed to ${isEditMode ? "update" : "create"} product`)
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
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic details about the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Professional Shampoo"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product..."
                  rows={4}
                  {...register("description")}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  defaultValue={product?.categoryId || undefined}
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

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the product price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="28.00"
                    {...register("price", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-destructive text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    placeholder="35.00"
                    {...register("compareAtPrice", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Original price for showing discount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage stock levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="SHMP-001"
                    {...register("sku")}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    placeholder="50"
                    {...register("stockQuantity", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Track Inventory</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable stock tracking for this product
                  </p>
                </div>
                <Switch
                  checked={watchTrackInventory}
                  onCheckedChange={(checked) => setValue("trackInventory", checked)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product photos</CardDescription>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <TrashIcon size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
                      isUploading ? "pointer-events-none opacity-50" : ""
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <SpinnerIcon size={20} className="animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <PlusIcon size={16} />
                        <span className="text-sm">Add more images</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                    isUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <SpinnerIcon size={48} className="text-muted-foreground/50 animate-spin" />
                  ) : (
                    <ImageIcon size={48} className="text-muted-foreground/50" />
                  )}
                  {!isUploading && (
                    <p className="text-muted-foreground mt-4 text-sm">
                      Click to upload images
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
                    Product is available for purchase
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
                    Show in featured section
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

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting || isDeleting}>
              {isSubmitting && (
                <SpinnerIcon size={16} className="mr-2 animate-spin" />
              )}
              {isEditMode ? "Update Product" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/products")}
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
                    Delete Product
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
