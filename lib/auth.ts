// Authentication utilities

import { cookies } from "next/headers"

export const AUTH_COOKIE = "quantumx_token"
export const ADMIN_COOKIE = "quantumx_admin_token"

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value || null
}

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value || null
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function setAdminToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  })
}

export async function clearAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function clearAdminToken() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

export function decodeToken(token: string): any {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(Buffer.from(payload, "base64").toString())
  } catch {
    return null
  }
}
