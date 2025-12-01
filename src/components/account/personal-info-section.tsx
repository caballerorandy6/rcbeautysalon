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
import { toast } from "sonner"
import { updateProfile } from "@/app/actions/account"
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile"
import { UserIcon } from "@/components/icons/user-icon"
import { PencilIcon } from "@/components/icons/pencil-icon"
import { SpinnerIcon } from "@/components/icons/spinner-icon"

interface PersonalInfoSectionProps {
  profile: {
    name: string | null
    email: string
    customer: {
      phone: string | null
    } | null
  }
}

export function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name || "",
      phone: profile.customer?.phone || "",
    },
  })

  async function onSubmit(data: UpdateProfileInput) {
    const result = await updateProfile(data)

    if (result.success) {
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } else {
      toast.error(result.error || "Failed to update profile")
    }
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
              className="text-muted-foreground hover:text-black"
            >
              <PencilIcon size={16} className="mr-1" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>Your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} disabled={isSubmitting} />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-destructive text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <SpinnerIcon size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-muted-foreground text-sm font-medium">
                Full Name
              </dt>
              <dd className="mt-1">{profile.name || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">
                Email
              </dt>
              <dd className="mt-1">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm font-medium">
                Phone
              </dt>
              <dd className="mt-1">{profile.customer?.phone || "Not set"}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
