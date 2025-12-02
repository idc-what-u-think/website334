"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const response = await api.getAnalytics(token)

      if (response.success && response.data) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error("[v0] Failed to load analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const growthData = analytics.serverGrowth || []
  const userGrowthData = analytics.userGrowth || []
  const commandUsageData = analytics.commandUsage || []
  const categoryData = analytics.categoryBreakdown || []

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Growth and engagement metrics</p>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Server Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="servers" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Command Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Command Usage Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={commandUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="commands"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Command Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Most Active Servers</h4>
          <div className="space-y-3">
            {(analytics.mostActiveServers || []).map((server: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{server.name}</span>
                <span className="text-sm font-bold">{server.commands}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Most Active Users</h4>
          <div className="space-y-3">
            {(analytics.mostActiveUsers || []).map((user: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{user.username}</span>
                <span className="text-sm font-bold">{user.commands}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Peak Usage Hours</h4>
          <div className="space-y-3">
            {(analytics.peakHours || []).map((hour: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{hour.hour}:00</span>
                <span className="text-sm font-bold">{hour.commands}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
