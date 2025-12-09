"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusIcon, CalendarIcon } from "@/components/icons"

// Mock data
const mockRequests = [
  {
    id: "1",
    startDate: "Dec 24, 2025",
    endDate: "Dec 26, 2025",
    reason: "Christmas Holiday",
    status: "APPROVED",
  },
  {
    id: "2",
    startDate: "Jan 1, 2026",
    endDate: "Jan 1, 2026",
    reason: "New Year's Day",
    status: "PENDING",
  },
]

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "destructive",
}

export function StaffTimeOffRequests() {
  // TODO: Fetch real requests from server action

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Time Off Requests</CardTitle>
          <CardDescription>Your vacation and leave requests</CardDescription>
        </div>
        <Button size="sm">
          <PlusIcon size={16} className="mr-2" />
          New Request
        </Button>
      </CardHeader>
      <CardContent>
        {mockRequests.length > 0 ? (
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarIcon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{request.reason}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.startDate}
                      {request.startDate !== request.endDate &&
                        ` - ${request.endDate}`}
                    </p>
                  </div>
                </div>

                <Badge variant={statusVariants[request.status]}>
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CalendarIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">No time off requests</h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t submitted any time off requests yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
