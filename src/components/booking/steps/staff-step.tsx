"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircleIcon } from "@/components/icons"
import { AvailableStaffMember } from "@/lib/interfaces"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

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
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {availableStaff.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No staff available for this service
            </p>
          ) : (
            availableStaff.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => onSelectStaff(staff.id)}
                className={`group relative w-full cursor-pointer rounded-2xl border-2 p-6 text-left transition-colors ${
                  selectedStaffId === staff.id
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-primary/30 bg-card hover:bg-primary/5 hover:border-primary/50"
                }`}
              >
                {selectedStaffId === staff.id && (
                  <CheckCircleIcon
                    size={32}
                    weight="fill"
                    className="absolute right-4 top-4 text-primary"
                  />
                )}
                <div className="flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/30">
                    {staff.image ? (
                      <Image
                        src={cloudinaryPresets.staffAvatar(staff.image)}
                        alt={staff.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                        {staff.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-3xl font-bold">{staff.name}</h3>
                    {staff.bio && (
                      <p className="mt-2 line-clamp-2 text-base text-muted-foreground">
                        {staff.bio}
                      </p>
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
