import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  SettingsIcon,
  ImageIcon,
} from "@/components/icons"

// Mockup data - will be replaced with real data
const settings = {
  name: "RC Beauty Salon",
  email: "contact@rcbeautysalon.com",
  phone: "(555) 123-4567",
  address: "123 Beauty Street",
  city: "Miami",
  state: "FL",
  zipCode: "33101",
  country: "US",
  timezone: "America/New_York",
  currency: "USD",
  bookingDeposit: 50.00,
  depositRefundable: false,
  minBookingAdvance: 24,
  maxBookingAdvance: 30,
  cancellationPolicy: "Cancellations must be made at least 24 hours in advance. The $50 deposit is non-refundable for no-shows or late cancellations.",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your salon settings
          </p>
        </div>
        <Button>
          <SettingsIcon size={16} className="mr-2" />
          Save All Changes
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
                <Input id="name" defaultValue={settings.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={settings.email} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={settings.phone} />
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
              <Input id="address" defaultValue={settings.address} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue={settings.city} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" defaultValue={settings.state} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" defaultValue={settings.zipCode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  defaultValue={settings.country}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  defaultValue={settings.timezone}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  defaultValue={settings.currency}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
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
                  defaultValue={settings.bookingDeposit}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Deposit Refundable</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow deposit refunds on cancellation
                  </p>
                </div>
                <Switch defaultChecked={settings.depositRefundable} />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minAdvance">Minimum Booking Advance (hours)</Label>
                <Input
                  id="minAdvance"
                  type="number"
                  defaultValue={settings.minBookingAdvance}
                />
                <p className="text-xs text-muted-foreground">
                  How far in advance customers must book
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAdvance">Maximum Booking Advance (days)</Label>
                <Input
                  id="maxAdvance"
                  type="number"
                  defaultValue={settings.maxBookingAdvance}
                />
                <p className="text-xs text-muted-foreground">
                  How far in advance customers can book
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Textarea
                id="cancellationPolicy"
                defaultValue={settings.cancellationPolicy}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This will be shown to customers during booking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
              <div>
                <p className="font-medium">Reset All Settings</p>
                <p className="text-sm text-muted-foreground">
                  Reset all settings to default values
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
