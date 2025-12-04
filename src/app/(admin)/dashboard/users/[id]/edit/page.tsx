import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { getUserById } from "@/app/actions/users"
import { UserEditForm } from "@/components/dashboard/user-edit-form"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/users/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          {user.image ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">{user.name || user.email}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <UserEditForm
        userId={user.id}
        currentRole={user.role}
        currentNotes={user.customer?.notes || ""}
        hasCustomer={!!user.customer}
        userName={user.name || user.email}
      />
    </div>
  )
}
