import { type NextRequest, NextResponse } from "next/server"
import { api } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/login?error=access_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    // Exchange code for token via Cloudflare API
    const response = await api.googleAuth(code)

    if (response.success && response.data) {
      const { token } = response.data

      // Redirect to callback page with token
      const redirectUrl = new URL("/auth/success", request.url)
      redirectUrl.searchParams.set("token", token)

      return NextResponse.redirect(redirectUrl)
    } else {
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
    }
  } catch (error) {
    console.error("[v0] Auth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=server_error", request.url))
  }
}
