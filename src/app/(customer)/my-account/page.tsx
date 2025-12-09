import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"

export const metadata: Metadata = {
  title: "My Account | RC Beauty Salon",
  description: "Manage your profile, view appointments, and update your account settings.",
}
import {
  getUserProfile,
  getUserStats,
  getOrderStats,
  getNotificationPreferences,
  getPaymentHistory,
} from "@/app/actions/account"
import { ProfileHeader } from "@/components/account/profile-header"
import { PersonalInfoSection } from "@/components/account/personal-info-section"
import { AppointmentsSummary } from "@/components/account/appointments-summary"
import { SecuritySection } from "@/components/account/security-section"
import { OrdersSummary } from "@/components/account/orders-summary"
import { NotificationPreferences } from "@/components/account/notification-preferences"
import { PaymentHistory } from "@/components/account/payment-history"

export default async function MyAccountPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login?callbackUrl=/my-account")
  }

  const [profile, stats, orderStats, notificationPrefs, payments] = await Promise.all([
    getUserProfile(),
    getUserStats(),
    getOrderStats(),
    getNotificationPreferences(),
    getPaymentHistory(),
  ])

  if (!profile) {
    redirect("/login?callbackUrl=/my-account")
  }

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
            My Account
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <ProfileHeader profile={profile} />

        {/* Main Content Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Personal Info */}
          <PersonalInfoSection profile={profile} />

          {/* Appointments Summary */}
          <AppointmentsSummary stats={stats} />

          {/* Orders Summary */}
          <OrdersSummary stats={orderStats} />

          {/* Notification Preferences */}
          <NotificationPreferences preferences={notificationPrefs} />
        </div>

        {/* Payment History - Full Width */}
        <div className="mt-6">
          <PaymentHistory payments={payments} />
        </div>

        {/* Security Section */}
        <div className="mt-6">
          <SecuritySection email={profile.email} />
        </div>
      </div>
    </div>
  )
}
