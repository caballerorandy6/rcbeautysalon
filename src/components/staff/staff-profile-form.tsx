"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  SpinnerIcon,
  UserIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@/components/icons"
import {
  staffSelfUpdateSchema,
  type StaffSelfUpdateFormData,
} from "@/lib/validations/staff"

interface StaffProfileData {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
}

interface StaffProfileFormProps {
  profile: StaffProfileData | null
}

export function StaffProfileForm({ profile }: StaffProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StaffSelfUpdateFormData>({
    resolver: zodResolver(staffSelfUpdateSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
    },
  })

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
        </CardContent>
      </Card>
    )
  }

  async function onSubmit(data: StaffSelfUpdateFormData) {
    // TODO: Implement - call updateStaffProfile server action
    // const result = await updateStaffProfile(data)
    // if (result.success) {
    //   toast.success("Profile updated successfully")
    //   setIsEditing(false)
    // } else {
    //   toast.error(result.error || "Failed to update profile")
    // }
    console.log("Form data:", data)
    toast.success("Profile updated successfully")
    setIsEditing(false)
  }

  function handleCancel() {
    reset()
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon size={20} className="text-primary" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <PencilIcon size={16} className="mr-1" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          {isEditing ? "Update your profile details" : "Your profile details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserIcon size={14} className="text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                disabled={isSubmitting}
                className="h-11"
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email - Read only */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <EnvelopeIcon size={14} className="text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={profile.email || ""}
                disabled
                className="bg-muted/50 h-11"
              />
              <p className="text-muted-foreground text-xs">
                Contact admin to change your email address
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <PhoneIcon size={14} className="text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
                className="h-11"
              />
              {errors.phone && (
                <p className="text-destructive text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell clients about yourself, your experience, and specialties..."
                rows={4}
                disabled={isSubmitting}
                className="resize-none"
              />
              {errors.bio && (
                <p className="text-destructive text-sm">{errors.bio.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                This will be shown on your public profile page
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t pt-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 min-w-[120px]"
              >
                {isSubmitting && (
                  <SpinnerIcon size={16} className="mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-5">
            <div className="bg-muted/30 rounded-lg p-4">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <UserIcon size={14} />
                Full Name
              </dt>
              <dd className="mt-1 font-medium">{profile.name}</dd>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <EnvelopeIcon size={14} />
                Email
              </dt>
              <dd className="mt-1">{profile.email || "Not set"}</dd>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <PhoneIcon size={14} />
                Phone
              </dt>
              <dd className="mt-1">{profile.phone || "Not set"}</dd>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <dt className="text-muted-foreground text-sm font-medium">Bio</dt>
              <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {profile.bio || "No bio added yet"}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
