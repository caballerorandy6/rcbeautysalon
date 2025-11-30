import { PublicNavbar } from "@/components/layouts/public-navbar"

export default function PublicLayout({
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
