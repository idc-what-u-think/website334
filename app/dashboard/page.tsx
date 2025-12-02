"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ServerCard } from "@/components/ServerCard"
import { Chat } from "@/components/Chat"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Trophy, Zap, Command, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user, updateUser } = useAuth()
  const [username, setUsername] = useState("")
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [servers, setServers] = useState([])
  const [stats, setStats] = useState({
    rank: 0,
    totalXP: 0,
    commandsUsed: 0,
    serversCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setUsername(user.username || "")
      setIsEditingUsername(!user.username)
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("quantumx_token")
      if (!token) return

      // Load servers and stats in parallel
      const [serversResponse, statsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/servers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (serversResponse.ok) {
        const serversData = await serversResponse.json()
        setServers(serversData.data || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data || stats)
      }
    } catch (error) {
      console.error("[v0] Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUsername = async () => {
    if (!username || username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error("Username can only contain letters, numbers, and underscores")
      return
    }

    try {
      const token = localStorage.getItem("quantumx_token")
      if (!token) return

      const response = await api.updateUsername(token, username)

      if (response.success) {
        updateUser({ ...user!, username })
        setIsEditingUsername(false)
        toast.success("Username updated successfully")
      } else {
        toast.error(response.error || "Failed to update username")
      }
    } catch (error) {
      toast.error("Failed to update username")
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="h-20 w-20 rounded-full" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {(user.username || user.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.username || "New User"}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>

              {isEditingUsername && (
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="username">Choose your username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username..."
                      maxLength={20}
                    />
                    <Button onClick={handleSaveUsername}>Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    3-20 characters, letters, numbers, and underscores only
                  </p>
                </div>
              )}

              {!isEditingUsername && (
                <Button variant="outline" onClick={() => setIsEditingUsername(true)}>
                  Edit Username
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Global Rank</p>
                <p className="text-2xl font-bold">#{stats.rank || "N/A"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Command className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commands Used</p>
                <p className="text-2xl font-bold">{stats.commandsUsed.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Servers</p>
                <p className="text-2xl font-bold">{servers.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* My Servers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Servers</h2>
            <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <Button>Add Bot to Server</Button>
            </a>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading servers...</p>
            </div>
          ) : servers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((server: any) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You don't have any servers with QuantumX Bot yet.</p>
              <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <Button>Add to Your Server</Button>
              </a>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Community Chat</h2>
          <Chat />
        </div>
      </div>
    </div>
  )
}
