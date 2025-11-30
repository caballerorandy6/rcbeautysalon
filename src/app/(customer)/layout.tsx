import { PublicNavbar } from "@/components/layouts/public-navbar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
    </>
  )
}
