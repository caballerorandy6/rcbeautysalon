import { auth } from "@/lib/auth/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Route definitions
  const isAdminDashboard = pathname.startsWith("/dashboard")
  const isStaffPortal = pathname.startsWith("/staff-portal")
  const isClientArea = pathname.startsWith("/my-account")
  const isAuthPage = pathname === "/login" || pathname === "/register"

  // Admin Dashboard - ONLY ADMIN
  if (isAdminDashboard) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      )
    }
    if (userRole !== "ADMIN") {
      // Staff and clients redirected to their areas
      if (userRole === "STAFF") {
        return NextResponse.redirect(new URL("/staff-portal", req.url))
      }
      if (userRole === "CLIENTE") {
        return NextResponse.redirect(new URL("/my-account", req.url))
      }
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Staff Portal - STAFF and ADMIN
  if (isStaffPortal) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      )
    }
    if (userRole !== "STAFF" && userRole !== "ADMIN") {
      // Clients can't access staff portal
      if (userRole === "CLIENTE") {
        return NextResponse.redirect(new URL("/my-account", req.url))
      }
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Client Area - CLIENTE and ADMIN
  if (isClientArea) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      )
    }
    if (userRole !== "CLIENTE" && userRole !== "ADMIN") {
      // Staff can't access client area
      if (userRole === "STAFF") {
        return NextResponse.redirect(new URL("/staff-portal", req.url))
      }
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Redirect authenticated users from auth pages to their dashboard
  if (isLoggedIn && isAuthPage) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    if (userRole === "STAFF") {
      return NextResponse.redirect(new URL("/staff-portal", req.url))
    }
    if (userRole === "CLIENTE") {
      return NextResponse.redirect(new URL("/my-account", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
