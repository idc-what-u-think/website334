"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { Code, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AdminCommandsPage() {
  const [analytics, setAnalytics] = useState<any>({
    totalCommands: 0,
    commandsToday: 0,
    avgExecutionTime: 0,
    successRate: 0,
  })
  const [commands, setCommands] = useState<any[]>([])
  const [topCommands, setTopCommands] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCommandAnalytics()
  }, [])

  const loadCommandAnalytics = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const response = await api.getCommandAnalytics(token)

      if (response.success && response.data) {
        setAnalytics(response.data.analytics || analytics)
        setCommands(response.data.commands || [])
        setTopCommands(response.data.topCommands || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load command analytics:", error)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Command Analytics</h1>
        <p className="text-muted-foreground">Monitor command usage and performance</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Commands</p>
              <p className="text-2xl font-bold">{analytics.totalCommands.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commands Today</p>
              <p className="text-2xl font-bold">{analytics.commandsToday.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Execution</p>
              <p className="text-2xl font-bold">{analytics.avgExecutionTime}ms</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{analytics.successRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Commands Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Top 10 Most Used Commands</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCommands}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usageCount" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Command List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">All Commands</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commands.map((command) => (
                <TableRow key={command.name}>
                  <TableCell>
                    <span className="font-mono">/{command.name}</span>
                  </TableCell>
                  <TableCell>{command.category}</TableCell>
                  <TableCell>{command.usageCount?.toLocaleString()}</TableCell>
                  <TableCell>{command.successRate}%</TableCell>
                  <TableCell>{command.avgTime}ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
