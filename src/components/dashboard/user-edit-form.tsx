"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrashIcon } from "@/components/icons"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { updateUserRole, updateCustomerNotes, deleteUser } from "@/app/actions/users"
import { toast } from "sonner"

interface UserEditFormProps {
  userId: string
  currentRole: "ADMIN" | "STAFF" | "CLIENTE"
  currentNotes: string
  hasCustomer: boolean
  userName: string
}

const roles = [
  { value: "CLIENTE", label: "Cliente", description: "Can book appointments and buy products" },
  { value: "STAFF", label: "Staff", description: "Can manage their appointments and schedule" },
  { value: "ADMIN", label: "Admin", description: "Full access to all features" },
]

export function UserEditForm({
  userId,
  currentRole,
  currentNotes,
  hasCustomer,
  userName,
}: UserEditFormProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [notes, setNotes] = useState(currentNotes)
  const [isSavingRole, setIsSavingRole] = useState(false)
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole as typeof currentRole)
    setIsSavingRole(true)

    try {
      const result = await updateUserRole(userId, newRole as "ADMIN" | "STAFF" | "CLIENTE")

      if (result.success) {
        toast.success("Role updated successfully")
      } else {
        toast.error(result.error || "Failed to update role")
        setRole(currentRole) // Revert on error
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("An unexpected error occurred")
      setRole(currentRole) // Revert on error
    } finally {
      setIsSavingRole(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)

    try {
      const result = await updateCustomerNotes(userId, notes)

      if (result.success) {
        toast.success("Notes saved successfully")
      } else {
        toast.error(result.error || "Failed to save notes")
      }
    } catch (error) {
      console.error("Error saving notes:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSavingNotes(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const result = await deleteUser(userId)

      if (result.success) {
        toast.success("User deleted successfully")
        router.push("/dashboard/users")
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Role */}
        <Card>
          <CardHeader>
            <CardTitle>User Role</CardTitle>
            <CardDescription>
              Change the user&apos;s access level in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={handleRoleChange}
                disabled={isSavingRole}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isSavingRole && (
                <SpinnerIcon size={14} className="text-muted-foreground animate-spin" />
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium">{roles.find((r) => r.value === role)?.label}</p>
              <p className="text-muted-foreground text-sm">
                {roles.find((r) => r.value === role)?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Notes */}
        {hasCustomer && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Notes</CardTitle>
              <CardDescription>
                Internal notes about this customer (preferences, allergies, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this customer..."
                  rows={5}
                  disabled={isSavingNotes}
                />
              </div>
              <Button
                onClick={handleSaveNotes}
                disabled={isSavingNotes || notes === currentNotes}
              >
                {isSavingNotes && (
                  <SpinnerIcon size={16} className="mr-2 animate-spin" />
                )}
                Save Notes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/dashboard/users/${userId}`)}
            >
              Back to User Details
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                  <p className="font-medium">Delete User</p>
                  <p className="text-muted-foreground text-sm">
                    Permanently remove this user
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <SpinnerIcon size={14} className="animate-spin" />
                  ) : (
                    <>
                      <TrashIcon size={14} className="mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Note: Users with existing appointments or orders cannot be deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
