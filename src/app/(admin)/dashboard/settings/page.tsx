import { getSalonSettings } from "@/app/actions/settings"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const settings = await getSalonSettings()

  return <SettingsForm initialSettings={settings} />
}
