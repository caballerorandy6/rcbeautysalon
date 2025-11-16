import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Book Your Appointment</h1>
          <p className="text-muted-foreground">
            Choose your service, select a time, and secure your spot
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Booking Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Step 1: Select Service */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select Service</CardTitle>
                <CardDescription>Choose the service you want to book</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Haircut & Styling", duration: "60 min", price: "$50" },
                  { name: "Hair Color", duration: "120 min", price: "$120" },
                  { name: "Manicure & Pedicure", duration: "90 min", price: "$75" },
                  { name: "Facial Treatment", duration: "60 min", price: "$85" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:bg-muted/50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant="secondary">{service.price}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {service.duration}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Step 2: Select Staff */}
            <Card>
              <CardHeader>
                <CardTitle>2. Select Staff Member</CardTitle>
                <CardDescription>Choose your preferred stylist</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Sarah Johnson", specialty: "Hair Specialist" },
                  { name: "Michael Brown", specialty: "Color Expert" },
                  { name: "Emma Davis", specialty: "Nail Artist" },
                  { name: "Any Available", specialty: "First available" },
                ].map((staff) => (
                  <div
                    key={staff.name}
                    className="cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{staff.name}</h3>
                        <p className="text-sm text-muted-foreground">{staff.specialty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Step 3: Select Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>3. Select Date & Time</CardTitle>
                <CardDescription>Choose when you'd like to visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar mode="single" className="rounded-md border" />

                <div>
                  <Label className="mb-2 block">Available Times</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((time) => (
                      <Button key={time} variant="outline" size="sm">
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Your Information */}
            <Card>
              <CardHeader>
                <CardTitle>4. Your Information</CardTitle>
                <CardDescription>Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Input id="notes" placeholder="Any special requests or preferences?" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Service</p>
                    <p className="text-muted-foreground">Haircut & Styling</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Staff</p>
                    <p className="text-muted-foreground">Sarah Johnson</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-muted-foreground">
                      <CalendarIcon className="mr-1 inline h-3 w-3" />
                      Select date and time
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-muted-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />
                      60 minutes
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Price</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Deposit Required</span>
                    <span className="text-primary">$50.00</span>
                  </div>
                </div>

                {/* Non-refundable warning */}
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-amber-900 dark:text-amber-100">
                        Non-Refundable Deposit
                      </p>
                      <p className="text-amber-800 dark:text-amber-200">
                        The $50 deposit is required to secure your appointment and is
                        <strong> non-refundable</strong>. Please ensure you can attend before booking.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pay $50 & Confirm Booking
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
