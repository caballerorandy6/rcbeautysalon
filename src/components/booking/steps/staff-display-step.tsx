"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircleIcon } from "@/components/icons"
import { AvailableStaffMember } from "@/lib/interfaces"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

interface StaffDisplayStepProps {
  staff: AvailableStaffMember
}

export function StaffDisplayStep({ staff }: StaffDisplayStepProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={24} weight="fill" className="text-primary" />
          <CardTitle>Your Specialist</CardTitle>
        </div>
        <CardDescription>You&apos;re booking with this specialist</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
              {staff.image ? (
                <Image
                  src={cloudinaryPresets.staffAvatar(staff.image)}
                  alt={staff.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
                  {staff.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-xl font-bold text-primary">{staff.name}</h3>
              {staff.bio && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {staff.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
