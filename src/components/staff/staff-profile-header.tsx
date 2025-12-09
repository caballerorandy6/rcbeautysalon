import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CalendarCheckIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@/components/icons"

interface StaffProfile {
  id: string
  name: string
  email: string | null
  phone: string | null
  image: string | null
  bio: string | null
  isActive: boolean
  createdAt: Date
  totalCompletedAppointments: number
}

interface StaffProfileHeaderProps {
  profile: StaffProfile | null
}

export function StaffProfileHeader({ profile }: StaffProfileHeaderProps) {
  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
        </CardContent>
      </Card>
    )
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="overflow-hidden">
      {/* Gradient Header Background */}
      <div className="from-primary/20 via-primary/10 to-transparent h-24 bg-linear-to-r sm:h-32" />

      <CardContent className="-mt-12 pb-6 sm:-mt-16">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="ring-background h-24 w-24 ring-4 sm:h-32 sm:w-32">
              <AvatarImage src={profile.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold sm:text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant={profile.isActive ? "default" : "secondary"}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold sm:text-2xl">{profile.name}</h2>

            {/* Contact Info */}
            <div className="text-muted-foreground mt-2 flex flex-col items-center gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <EnvelopeIcon size={14} />
                  {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <PhoneIcon size={14} />
                  {profile.phone}
                </span>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          {/* Completed Appointments */}
          <div className="bg-muted/50 rounded-xl p-3 text-center sm:p-4">
            <div className="flex items-center justify-center gap-1.5">
              <CalendarCheckIcon size={18} className="text-primary" />
              <span className="text-lg font-bold sm:text-xl">
                {profile.totalCompletedAppointments}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              Completed
            </p>
          </div>

          {/* Member Since */}
          <div className="bg-muted/50 rounded-xl p-3 text-center sm:p-4">
            <div className="flex items-center justify-center gap-1.5">
              <ClockIcon size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium sm:text-base">
                {memberSince}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              Member since
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
