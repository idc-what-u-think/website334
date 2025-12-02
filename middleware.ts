import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthToken, getAdminToken, decodeToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const decoded = decodeToken(token)
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = await getAdminToken()

    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const decoded = decodeToken(adminToken)
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
