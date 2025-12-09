"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, SearchIcon } from "@/components/icons"

interface StaffAppointmentsFilterProps {
  filters: {
    dateFilter: "today" | "week" | "month" | "all" | undefined
    statusFilter:
      | "ALL"
      | "PENDING"
      | "CONFIRMED"
      | "COMPLETED"
      | "CANCELLED"
      | "NO_SHOW"
    search: string | undefined
  }
}

export function StaffAppointmentsFilter({
  filters,
}: StaffAppointmentsFilterProps) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  // Handle search date
  const handlerSearchDate = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (value) {
        params.set("dateFilter", value)
      } else {
        params.delete("dateFilter")
      }
      router.push(`/staff-portal/appointments?${params.toString()}`)
    })
  }

  // Handle search status
  const handlerSearchStatus = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (value && value !== "all") {
        params.set("statusFilter", value.toUpperCase())
      } else {
        params.delete("statusFilter")
      }
      router.push(`/staff-portal/appointments?${params.toString()}`)
    })
  }

  // Handle search input
  const handlerSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      router.push(`/staff-portal/appointments?${params.toString()}`)
    })
  }

  return (
    <Card className={isPending ? "pointer-events-none opacity-60" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              onChange={handlerSearchInput}
              value={filters.search || ""}
              placeholder="Search by customer name..."
              className="pl-10"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlerSearchDate("today")}
              title="Reset to today"
            >
              <CalendarIcon size={18} />
            </Button>
            <Select
              value={filters.dateFilter || "today"}
              onValueChange={handlerSearchDate}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <Select
            value={filters.statusFilter?.toLowerCase() || "all"}
            onValueChange={handlerSearchStatus}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
