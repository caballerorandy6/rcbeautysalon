import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
