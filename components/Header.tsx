"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-bold">QuantumX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#commands"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Commands
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Support Server
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <Button>Add to Discord</Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/#commands" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              Commands
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Support Server
            </a>
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Add to Discord</Button>
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
