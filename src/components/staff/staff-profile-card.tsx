import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ArrowRightIcon,
} from "@/components/icons"

interface StaffProfileCardProps {
  profile: {
    id: string
    name: string
    email: string | null
    phone: string | null
    image: string | null
    bio: string | null
    isActive: boolean
  } | null
}

export function StaffProfileCard({ profile }: StaffProfileCardProps) {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon size={20} className="text-primary" />
            <CardTitle className="text-lg">My Profile</CardTitle>
          </div>
          <Badge variant={profile.isActive ? "default" : "secondary"}>
            {profile.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={profile.image || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold">{profile.name}</h3>
            {profile.bio && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm">
              <EnvelopeIcon size={14} className="text-muted-foreground" />
              <span className="truncate text-foreground">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon size={14} className="text-muted-foreground" />
              <span className="text-foreground">{profile.phone}</span>
            </div>
          )}
          {!profile.email && !profile.phone && (
            <p className="text-sm text-muted-foreground">
              No contact info added
            </p>
          )}
        </div>

        {/* View Profile Link */}
        <Link href="/staff-portal/profile">
          <Button variant="outline" className="w-full">
            View Full Profile
            <ArrowRightIcon size={16} className="ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
