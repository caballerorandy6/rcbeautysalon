import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { StaffSidebar } from "@/components/staff/staff-sidebar"
import { StaffHeader } from "@/components/staff/staff-header"

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Only STAFF role can access
  if (!session?.user || session.user.role !== "STAFF") {
    redirect("/login")
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <StaffHeader user={session.user} />
      <div className="flex">
        <StaffSidebar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
