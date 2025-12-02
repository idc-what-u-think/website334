import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuantumX Bot - The Most Advanced Discord Bot",
  description:
    "Transform your Discord server with QuantumX Bot. 300+ commands, advanced moderation, economy system, leveling, music player, and AI integration.",
  keywords: ["Discord bot", "QuantumX", "moderation", "economy", "leveling", "music bot"],
  openGraph: {
    title: "QuantumX Bot - The Most Advanced Discord Bot",
    description: "Transform your Discord server with 300+ commands",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
