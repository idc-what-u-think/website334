"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("quantumx_token")
      if (token) {
        const response = await api.getCurrentUser(token)
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          localStorage.removeItem("quantumx_token")
        }
      }
    } catch (error) {
      console.error("[v0] Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (token: string) => {
    localStorage.setItem("quantumx_token", token)
    const response = await api.getCurrentUser(token)
    if (response.success && response.data) {
      setUser(response.data)
    }
  }

  const logout = async () => {
    localStorage.removeItem("quantumx_token")
    setUser(null)
    window.location.href = "/"
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
