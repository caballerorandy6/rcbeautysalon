import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
} from "@/components/icons"
import Link from "next/link"
import {
  getDashboardStats,
  getTodaysAppointments,
  getRecentActivities,
} from "@/app/actions/dashboard"
import { format, formatDistanceToNow } from "date-fns"
import { formatCurrency, formatChange } from "@/lib/utils/format"

export default async function AdminDashboard() {
  const [stats, todaysAppointments, recentActivities] = await Promise.all([
    getDashboardStats(),
    getTodaysAppointments(),
    getRecentActivities(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue (This Month)
            </CardTitle>
            <CurrencyDollarIcon size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.revenue.change !== 0 && (
                <>
                  <TrendingUpIcon
                    size={12}
                    className={`mr-1 inline ${stats.revenue.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  />
                  {formatChange(stats.revenue.change)} from last month
                </>
              )}
              {stats.revenue.change === 0 && "No previous data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarIcon size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.appointments.total.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +{stats.appointments.monthly} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <UsersIcon size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.customers.total.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +{stats.customers.weekly} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Sales</CardTitle>
            <ShoppingBagIcon size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.orders.total.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.orders.change !== 0 && (
                <>{formatChange(stats.orders.change)} from last month</>
              )}
              {stats.orders.change === 0 && "No previous data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Appointments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>
              You have {todaysAppointments.length} appointment
              {todaysAppointments.length !== 1 ? "s" : ""} today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No appointments scheduled for today
                </p>
              ) : (
                todaysAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold">
                        <ClockIcon size={20} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {apt.customer?.name || apt.guestName || "Guest"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {apt.services.map((s) => s.service.name).join(", ")} •
                          Staff: {apt.staff.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {format(new Date(apt.startTime), "h:mm a")}
                      </p>
                      <Link href={`/dashboard/appointments/${apt.id}`}>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/appointments">
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
            <Link href="/dashboard/appointments/new">
              <Button className="w-full justify-start" variant="outline">
                <CalendarIcon size={16} className="mr-2" />
                New Appointment
              </Button>
            </Link>
            <Link href="/dashboard/products/new">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBagIcon size={16} className="mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button className="w-full justify-start" variant="outline">
                <UsersIcon size={16} className="mr-2" />
                Manage Customers
              </Button>
            </Link>
          </CardContent>

          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No recent activity
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full ${
                        activity.color === "green"
                          ? "bg-green-500"
                          : activity.color === "blue"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
