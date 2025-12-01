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
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  CalendarIcon,
} from "@/components/icons"
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
      <DialogContent className="max-w-lg overflow-hidden p-0">
        {/* Header con imagen */}
        <div className="from-primary/20 to-accent/20 relative bg-linear-to-br px-6 pt-8 pb-16">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
          <div className="relative flex flex-col items-center">
            {staff.image ? (
              <Image
                src={cloudinaryPresets.staffAvatar(staff.image)}
                alt={staff.name}
                width={120}
                height={120}
                className="ring-background rounded-full object-cover shadow-xl ring-4"
              />
            ) : (
              <div className="bg-muted ring-background flex h-[120px] w-[120px] items-center justify-center rounded-full shadow-xl ring-4">
                <UserIcon size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-background relative -mt-8 rounded-t-3xl px-6 pb-6">
          <DialogHeader className="pt-4 text-center">
            <DialogTitle className="text-center text-2xl font-bold">
              {staff.name}
            </DialogTitle>
            <div className="text-accent flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={16} weight="fill" />
              ))}
              <span className="text-muted-foreground ml-1 text-sm">(5.0)</span>
            </div>
          </DialogHeader>

          {/* Bio */}
          {staff.bio && (
            <p className="text-muted-foreground mt-4 text-center text-sm leading-relaxed">
              {staff.bio}
            </p>
          )}

          {/* Contacto */}
          <div className="mt-6 flex flex-col gap-2">
            {staff.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <EnvelopeIcon size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">{staff.email}</span>
              </div>
            )}
            {staff.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <PhoneIcon size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">{staff.phone}</span>
              </div>
            )}
          </div>

          {/* Servicios */}
          {staff.staffServices && staff.staffServices.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold">Services</h4>
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
            className="from-primary to-accent mt-6 w-full bg-linear-to-r hover:opacity-90"
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
