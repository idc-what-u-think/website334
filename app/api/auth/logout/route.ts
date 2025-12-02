import { NextResponse } from "next/server"
import { clearAuthToken, clearAdminToken } from "@/lib/auth"

export async function POST() {
  try {
    await clearAuthToken()
    await clearAdminToken()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 })
  }
}
