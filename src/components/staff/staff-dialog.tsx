"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserIcon, PhoneIcon, EnvelopeIcon, StarIcon, CalendarIcon } from "@/components/icons"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

interface StaffDialogProps {
  staff: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    bio?: string | null
    image?: string | null
    isActive?: boolean
    staffServices?: {
      service: {
        id: string
        name: string
        duration: number
        price: number
      }
    }[]
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffDialog({ staff, open, onOpenChange }: StaffDialogProps) {
  if (!staff) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Header con imagen */}
        <div className="relative bg-linear-to-br from-primary/20 to-accent/20 pt-8 pb-16 px-6">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
          <div className="relative flex flex-col items-center">
            {staff.image ? (
              <Image
                src={cloudinaryPresets.staffAvatar(staff.image)}
                alt={staff.name}
                width={120}
                height={120}
                className="rounded-full object-cover ring-4 ring-background shadow-xl"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-muted ring-4 ring-background shadow-xl">
                <UserIcon size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="-mt-8 relative bg-background rounded-t-3xl px-6 pb-6">
          <DialogHeader className="pt-4 text-center">
            <DialogTitle className="text-2xl font-bold">{staff.name}</DialogTitle>
            <div className="flex items-center justify-center gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={16} weight="fill" />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">(5.0)</span>
            </div>
          </DialogHeader>

          {/* Bio */}
          {staff.bio && (
            <p className="mt-4 text-center text-muted-foreground text-sm leading-relaxed">
              {staff.bio}
            </p>
          )}

          {/* Contacto */}
          <div className="mt-6 flex flex-col gap-2">
            {staff.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <EnvelopeIcon size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">{staff.email}</span>
              </div>
            )}
            {staff.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <PhoneIcon size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">{staff.phone}</span>
              </div>
            )}
          </div>

          {/* Servicios */}
          {staff.staffServices && staff.staffServices.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Services</h4>
              <div className="flex flex-wrap gap-2">
                {staff.staffServices.map((ss) => (
                  <Badge
                    key={ss.service.id}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {ss.service.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botón de reservar */}
          <Button
            className="w-full mt-6 bg-linear-to-r from-primary to-accent hover:opacity-90"
            size="lg"
          >
            <CalendarIcon size={18} className="mr-2" />
            Book with {staff.name.split(" ")[0]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
