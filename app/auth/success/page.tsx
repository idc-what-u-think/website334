"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function AuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      login(token)
        .then(() => {
          toast.success("Successfully logged in!")
          router.push("/dashboard")
        })
        .catch(() => {
          toast.error("Login failed")
          router.push("/login")
        })
    } else {
      router.push("/login")
    }
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing login...</p>
      </div>
    </div>
  )
}
