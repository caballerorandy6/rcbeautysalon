"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserIcon } from "@/components/icons"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import { StaffDialog } from "./staff-dialog"

interface StaffCardProps {
  staff: {
    id: string
    name: string
    email: string | null
    phone: string | null
    bio: string | null
    image: string | null
    isActive: boolean
    services?: {
      service: {
        id: string
        name: string
        duration: number
        price: number
      }
    }[]
  }
}

export function StaffCard({ staff }: StaffCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full text-left"
      >
        <Card className="border-primary/10 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              {staff.image ? (
                <Image
                  src={cloudinaryPresets.staffAvatar(staff.image)}
                  alt={staff.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover transition-transform duration-300 hover:scale-110 ring-2 ring-transparent hover:ring-primary/50"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-transform duration-300 hover:scale-110">
                  <UserIcon size={24} className="text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-base">{staff.name}</CardTitle>
                {staff.bio && (
                  <CardDescription className="text-xs line-clamp-1">
                    {staff.bio}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </button>

      <StaffDialog
        staff={{
          ...staff,
          staffServices: staff.services
        }}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
