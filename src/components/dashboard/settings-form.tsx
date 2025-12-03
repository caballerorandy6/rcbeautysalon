"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SettingsIcon, ImageIcon } from "@/components/icons"
import { updateSalonSettings, resetSalonSettings } from "@/app/actions/settings"
import { SalonSettingsInput } from "@/lib/interfaces"
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

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useState(initialSettings)

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSalonSettings(settings as SalonSettingsInput)
      if (result.success) {
        toast.success("Settings saved successfully")
      } else {
        toast.error(result.error || "Failed to save settings")
      }
    })
  }

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset all settings to defaults?")) return

    startTransition(async () => {
      const result = await resetSalonSettings()
      if (result.success && result.settings) {
        setSettings(result.settings)
        toast.success("Settings reset to defaults")
      } else {
        toast.error(result.error || "Failed to reset settings")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your salon settings</p>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          <SettingsIcon size={16} className="mr-2" />
          {isPending ? "Saving..." : "Save All Changes"}
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
                <Label htmlFor="name">Salon Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
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
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
              <ImageIcon size={48} className="text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Drag and drop your logo, or click to browse
              </p>
              <Button variant="outline" className="mt-4">
                Upload Logo
              </Button>
            </div>
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
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={settings.city || ""}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={settings.state || ""}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={settings.zipCode || ""}
                  onChange={(e) => setSettings({ ...settings, zipCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={settings.country}
                  onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
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
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD ($)</option>
                </select>
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
                <Label htmlFor="deposit">Booking Deposit ($)</Label>
                <Input
                  id="deposit"
                  type="number"
                  step="0.01"
                  value={settings.bookingDeposit}
                  onChange={(e) => setSettings({ ...settings, bookingDeposit: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Deposit Refundable</Label>
                  <p className="text-xs text-muted-foreground">Allow deposit refunds</p>
                </div>
                <Switch
                  checked={settings.depositRefundable}
                  onCheckedChange={(checked) => setSettings({ ...settings, depositRefundable: checked })}
                />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minAdvance">Min Booking Advance (hours)</Label>
                <Input
                  id="minAdvance"
                  type="number"
                  value={settings.minBookingAdvance}
                  onChange={(e) => setSettings({ ...settings, minBookingAdvance: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAdvance">Max Booking Advance (days)</Label>
                <Input
                  id="maxAdvance"
                  type="number"
                  value={settings.maxBookingAdvance}
                  onChange={(e) => setSettings({ ...settings, maxBookingAdvance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Textarea
                id="cancellationPolicy"
                value={settings.cancellationPolicy || ""}
                onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
                rows={4}
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
              <Button variant="destructive" size="sm" onClick={handleReset} disabled={isPending}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
