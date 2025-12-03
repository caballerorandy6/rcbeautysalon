import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UsersIcon,
  EnvelopeIcon,
} from "@/components/icons"
import { getAdminUsers, getUserStats } from "@/app/actions/users"
import { UserSearch } from "@/components/dashboard/user-search"

interface UsersPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { search } = await searchParams
  const [users, stats] = await Promise.all([
    getAdminUsers(search),
    getUserStats(),
  ])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <Button>
          <UsersIcon size={16} className="mr-2" />
          Export List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Sessions</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.activeThisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New This Month</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.newThisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Registered Customers</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCustomers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <UserSearch />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Appointments</th>
                    <th className="pb-3 font-medium">Orders</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {user.name?.split(" ").map(n => n[0]).join("") || "?"}
                            </div>
                          )}
                          <p className="font-medium">{user.name || "No name"}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <EnvelopeIcon size={12} className="text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            : user.role === "STAFF"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-sm">{user.customer?._count.appointments || 0}</td>
                      <td className="py-4 text-sm">{user.customer?._count.orders || 0}</td>
                      <td className="py-4 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Link href={`/dashboard/users/${user.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
