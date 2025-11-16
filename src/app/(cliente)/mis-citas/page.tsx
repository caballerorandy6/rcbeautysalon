import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function MisCitasPage() {
  const upcomingAppointments = [
    {
      id: 1,
      date: "March 15, 2024",
      time: "10:00 AM",
      service: "Haircut & Styling",
      staff: "Sarah Johnson",
      status: "confirmed",
      price: 50,
      depositPaid: true,
    },
    {
      id: 2,
      date: "March 22, 2024",
      time: "2:30 PM",
      service: "Hair Color",
      staff: "Michael Brown",
      status: "pending",
      price: 120,
      depositPaid: true,
    },
  ]

  const pastAppointments = [
    {
      id: 3,
      date: "February 28, 2024",
      time: "11:00 AM",
      service: "Manicure & Pedicure",
      staff: "Emma Davis",
      status: "completed",
      price: 75,
    },
    {
      id: 4,
      date: "February 10, 2024",
      time: "3:00 PM",
      service: "Facial Treatment",
      staff: "Sarah Johnson",
      status: "completed",
      price: 85,
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      confirmed: { variant: "default", label: "Confirmed" },
      pending: { variant: "secondary", label: "Pending" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage your beauty appointments
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground">No upcoming appointments</p>
                  <Link href="/booking">
                    <Button>Book New Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{appointment.service}</CardTitle>
                        <CardDescription className="mt-1">
                          <Calendar className="mr-1 inline h-3 w-3" />
                          {appointment.date} at {appointment.time}
                        </CardDescription>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>With {appointment.staff}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Duration: 60 minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>123 Beauty Street, New York, NY</span>
                    </div>
                    {appointment.depositPaid && (
                      <div className="mt-4 rounded-md bg-green-50 p-3 dark:bg-green-950/20">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          ✓ Deposit Paid: $50.00 (Non-refundable)
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{appointment.service}</CardTitle>
                        <CardDescription className="mt-1">
                          <Calendar className="mr-1 inline h-3 w-3" />
                          {appointment.date} at {appointment.time}
                        </CardDescription>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>With {appointment.staff}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Paid:</span>
                      <span className="font-semibold">${appointment.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Book Again
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Link href="/booking">
            <Button size="lg" className="w-full sm:w-auto">
              <Calendar className="mr-2 h-5 w-5" />
              Book New Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
