import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeftIcon } from "@/components/icons"
import AdminAppointmentForm from "@/components/appointments/admin-appointment-form"
import {
  getActiveServicesForBooking,
  getAllActiveStaff,
} from "@/app/actions/services"
import { getCustomers } from "@/app/actions/customers"

export default async function NewAppointmentPage() {
  const services = await getActiveServicesForBooking()
  const staff = await getAllActiveStaff()
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Appointment</h1>
          <p className="text-muted-foreground">
            Create a new appointment for a customer
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminAppointmentForm
            services={services}
            staff={staff}
            customers={customers}
          />
        </CardContent>
      </Card>
    </div>
  )
}
