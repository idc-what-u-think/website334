"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Server, Users, Code, Activity, RefreshCw, Radio, Clock, Zap, MessageSquare, Shield } from "lucide-react"

export default function AdminDashboardPage() {
  const [botStats, setBotStats] = useState({
    status: "online",
    uptime: 0,
    latency: 0,
    lastRestart: "",
    totalServers: 0,
    totalUsers: 0,
    commandsToday: 0,
    activeUsers: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const response = await api.getAdminBotStats(token)

      if (response.success && response.data) {
        setBotStats(response.data)
      }

      // Load recent activity
      const activityResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/activity/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (activityResponse.ok) {
        const data = await activityResponse.json()
        setRecentActivity(data.data || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load admin dashboard:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestartBot = async () => {
    const token = localStorage.getItem("quantumx_admin_token")
    if (!token) return

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bot/restart`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: "Restarting bot...",
        success: "Bot restarted successfully",
        error: "Failed to restart bot",
      },
    )
  }

  const handleBroadcast = async () => {
    toast.info("Broadcast feature coming soon")
  }

  const handleBackup = async () => {
    toast.info("Database backup feature coming soon")
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your bot overview.</p>
      </div>

      {/* Bot Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Bot Status</h2>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-success animate-pulse" />
            <span className="text-sm font-medium text-success">
              {botStats.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Uptime</span>
            </div>
            <p className="text-2xl font-bold">{formatUptime(botStats.uptime)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Latency</span>
            </div>
            <p className="text-2xl font-bold">{botStats.latency}ms</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Last Restart</span>
            </div>
            <p className="text-sm font-medium">{botStats.lastRestart || "Never"}</p>
          </div>

          <div>
            <Button onClick={handleRestartBot} variant="outline" className="w-full bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart Bot
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Servers</p>
              <p className="text-2xl font-bold">{botStats.totalServers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{botStats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commands Today</p>
              <p className="text-2xl font-bold">{botStats.commandsToday.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{botStats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleRestartBot}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restart Bot
          </Button>
          <Button onClick={handleBroadcast} variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Broadcast Message
          </Button>
          <Button onClick={handleBackup} variant="outline">
            <Server className="w-4 h-4 mr-2" />
            Backup Database
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted">
                <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  )
}
