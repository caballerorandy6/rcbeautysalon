"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageIcon, TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { updateSalonSettings, resetSalonSettings } from "@/app/actions/settings"
import { settingsSchema, type SettingsFormData } from "@/lib/validations/settings"
import { toast } from "sonner"

interface SettingsFormProps {
  initialSettings: {
    name: string
    logo: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    country: string
    timezone: string
    currency: string
    bookingDeposit: number
    depositRefundable: boolean
    minBookingAdvance: number
    maxBookingAdvance: number
    cancellationPolicy: string | null
  }
}

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "GB", label: "United Kingdom" },
  { value: "ES", label: "Spain" },
]

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
]

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "MXN", label: "MXN ($)" },
]

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [logo, setLogo] = useState<string | null>(initialSettings.logo)
  const [isUploading, setIsUploading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialSettings.name,
      logo: initialSettings.logo || undefined,
      email: initialSettings.email || "",
      phone: initialSettings.phone || "",
      address: initialSettings.address || "",
      city: initialSettings.city || "",
      state: initialSettings.state || "",
      zipCode: initialSettings.zipCode || "",
      country: initialSettings.country,
      timezone: initialSettings.timezone,
      currency: initialSettings.currency,
      bookingDeposit: initialSettings.bookingDeposit,
      depositRefundable: initialSettings.depositRefundable,
      minBookingAdvance: initialSettings.minBookingAdvance,
      maxBookingAdvance: initialSettings.maxBookingAdvance,
      cancellationPolicy: initialSettings.cancellationPolicy || "",
    },
  })

  const watchDepositRefundable = watch("depositRefundable")

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append("type", "logo")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setLogo(data.url)
      toast.success("Logo uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to upload logo"
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Remove logo
  const handleRemoveLogo = () => {
    setLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle reset
  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings to defaults? This action cannot be undone."
    )

    if (!confirmed) return

    setIsResetting(true)
    try {
      const result = await resetSalonSettings()

      if (result.success && result.settings) {
        reset({
          name: result.settings.name,
          logo: result.settings.logo || undefined,
          email: result.settings.email || "",
          phone: result.settings.phone || "",
          address: result.settings.address || "",
          city: result.settings.city || "",
          state: result.settings.state || "",
          zipCode: result.settings.zipCode || "",
          country: result.settings.country,
          timezone: result.settings.timezone,
          currency: result.settings.currency,
          bookingDeposit: result.settings.bookingDeposit,
          depositRefundable: result.settings.depositRefundable,
          minBookingAdvance: result.settings.minBookingAdvance,
          maxBookingAdvance: result.settings.maxBookingAdvance,
          cancellationPolicy: result.settings.cancellationPolicy || "",
        })
        setLogo(result.settings.logo)
        toast.success("Settings reset to defaults")
      } else {
        toast.error(result.error || "Failed to reset settings")
      }
    } catch (error) {
      console.error("Reset error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsResetting(false)
    }
  }

  // Submit form
  const onSubmit = async (data: SettingsFormData) => {
    try {
      const settingsData = {
        ...data,
        logo: logo || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        cancellationPolicy: data.cancellationPolicy || undefined,
      }

      const result = await updateSalonSettings(settingsData)

      if (result.success) {
        toast.success("Settings saved successfully")
      } else {
        toast.error(result.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your salon settings</p>
          </div>
          <Button type="submit" disabled={isSubmitting || isResetting}>
            {isSubmitting ? (
              <>
                <SpinnerIcon size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Basic details about your salon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Salon Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Upload your salon logo</CardDescription>
            </CardHeader>
            <CardContent>
              {logo ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={logo}
                    alt="Salon logo"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveLogo}
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
                    <SpinnerIcon size={48} className="text-muted-foreground/50 animate-spin" />
                  ) : (
                    <ImageIcon size={48} className="text-muted-foreground/50" />
                  )}
                  <p className="text-muted-foreground mt-4 text-sm">
                    {isUploading ? "Uploading..." : "Click to upload an image"}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Your salon location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  {...register("address")}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    {...register("zipCode")}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    defaultValue={initialSettings.country}
                    onValueChange={(value) => setValue("country", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    defaultValue={initialSettings.timezone}
                    onValueChange={(value) => setValue("timezone", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    defaultValue={initialSettings.currency}
                    onValueChange={(value) => setValue("currency", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>Configure appointment booking rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bookingDeposit">Booking Deposit ($)</Label>
                  <Input
                    id="bookingDeposit"
                    type="number"
                    step="0.01"
                    {...register("bookingDeposit", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.bookingDeposit && (
                    <p className="text-destructive text-sm">{errors.bookingDeposit.message}</p>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Deposit Refundable</Label>
                    <p className="text-xs text-muted-foreground">Allow deposit refunds</p>
                  </div>
                  <Switch
                    checked={watchDepositRefundable}
                    onCheckedChange={(checked) => setValue("depositRefundable", checked)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minBookingAdvance">Min Booking Advance (hours)</Label>
                  <Input
                    id="minBookingAdvance"
                    type="number"
                    {...register("minBookingAdvance", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.minBookingAdvance && (
                    <p className="text-destructive text-sm">{errors.minBookingAdvance.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBookingAdvance">Max Booking Advance (days)</Label>
                  <Input
                    id="maxBookingAdvance"
                    type="number"
                    {...register("maxBookingAdvance", { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.maxBookingAdvance && (
                    <p className="text-destructive text-sm">{errors.maxBookingAdvance.message}</p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  {...register("cancellationPolicy")}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                  <p className="font-medium">Reset All Settings</p>
                  <p className="text-sm text-muted-foreground">Reset to defaults</p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSubmitting || isResetting}
                >
                  {isResetting ? (
                    <>
                      <SpinnerIcon size={14} className="mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
