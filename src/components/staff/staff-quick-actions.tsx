import Link from "next/link"
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
  ClockIcon,
  UserIcon,
  CalendarCheckIcon,
} from "@/components/icons"

export function StaffQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button variant="outline" className="justify-start h-auto py-3" asChild>
          <Link href="/staff-portal/appointments">
            <CalendarIcon size={20} className="mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">View All Appointments</p>
              <p className="text-xs text-muted-foreground">See your full schedule</p>
            </div>
          </Link>
        </Button>

        <Button variant="outline" className="justify-start h-auto py-3" asChild>
          <Link href="/staff-portal/schedule">
            <ClockIcon size={20} className="mr-3 text-blue-500" />
            <div className="text-left">
              <p className="font-medium">Manage Schedule</p>
              <p className="text-xs text-muted-foreground">Update working hours</p>
            </div>
          </Link>
        </Button>

        <Button variant="outline" className="justify-start h-auto py-3" asChild>
          <Link href="/staff-portal/profile">
            <UserIcon size={20} className="mr-3 text-green-500" />
            <div className="text-left">
              <p className="font-medium">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your info</p>
            </div>
          </Link>
        </Button>

        <Button variant="outline" className="justify-start h-auto py-3" disabled>
          <CalendarCheckIcon size={20} className="mr-3 text-orange-500" />
          <div className="text-left">
            <p className="font-medium">Request Time Off</p>
            <p className="text-xs text-muted-foreground">Submit vacation request</p>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}
