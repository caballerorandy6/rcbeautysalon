"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "@phosphor-icons/react"
import { AvailableStaffMember } from "@/lib/interfaces"

interface StaffStepProps {
  availableStaff: AvailableStaffMember[]
  selectedStaffId: string
  onSelectStaff: (staffId: string) => void
  error?: string
}

export function StaffStep({
  availableStaff,
  selectedStaffId,
  onSelectStaff,
  error,
}: StaffStepProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
            2
          </div>
          <CardTitle>Select Staff Member</CardTitle>
        </div>
        <CardDescription>Choose your preferred specialist</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {availableStaff.length === 0 ? (
            <p className="col-span-2 text-center text-muted-foreground">
              No staff available for this service
            </p>
          ) : (
            availableStaff.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => onSelectStaff(staff.id)}
                className={`group relative cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:border-primary hover:shadow-md ${
                  selectedStaffId === staff.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/30"
                }`}
              >
                {selectedStaffId === staff.id && (
                  <CheckCircle
                    size={24}
                    weight="fill"
                    className="absolute right-2 top-2 text-primary"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {staff.name.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold">{staff.name}</h3>
                    {staff.bio && (
                      <p className="truncate text-sm text-muted-foreground">{staff.bio}</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
