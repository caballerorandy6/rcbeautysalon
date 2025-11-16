import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, ShoppingBag, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-600" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +32 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Appointments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              You have 12 appointments today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "9:00 AM", customer: "Sarah Johnson", service: "Haircut & Styling", staff: "Emma" },
                { time: "10:30 AM", customer: "Michael Brown", service: "Hair Color", staff: "Sarah" },
                { time: "1:00 PM", customer: "Jessica Davis", service: "Manicure", staff: "Maria" },
                { time: "2:30 PM", customer: "David Wilson", service: "Facial Treatment", staff: "Emma" },
              ].map((apt, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{apt.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.service} • Staff: {apt.staff}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{apt.time}</p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/citas">
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/citas/new">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </Link>
            <Link href="/dashboard/productos/new">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
            <Link href="/dashboard/usuarios">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Customers
              </Button>
            </Link>
          </CardContent>

          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">New booking received</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Product order completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                <div>
                  <p className="font-medium">New customer registered</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
