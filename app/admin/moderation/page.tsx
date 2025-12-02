"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { Search, Download, XCircle } from "lucide-react"

export default function AdminModerationPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [blacklistedServers, setBlacklistedServers] = useState<any[]>([])
  const [blacklistedUsers, setBlacklistedUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModerationData()
  }, [])

  const loadModerationData = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const [logsResponse, blacklistResponse] = await Promise.all([
        api.getModerationLogs(token, {}),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blacklist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (logsResponse.success && logsResponse.data) {
        setLogs(logsResponse.data || [])
      }

      if (blacklistResponse.ok) {
        const blacklistData = await blacklistResponse.json()
        setBlacklistedServers(blacklistData.data?.servers || [])
        setBlacklistedUsers(blacklistData.data?.users || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load moderation data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportLogs = () => {
    // Export logs to CSV
    const csv = logs
      .map((log) => `${log.date},${log.server},${log.user},${log.moderator},${log.action},${log.reason}`)
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "moderation-logs.csv"
    a.click()
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
        <h1 className="text-3xl font-bold mb-2">Moderation</h1>
        <p className="text-muted-foreground">View moderation logs and manage blacklists</p>
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Moderation Logs</TabsTrigger>
          <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleExportLogs} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Moderator</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs
                    .filter((log) => JSON.stringify(log).toLowerCase().includes(search.toLowerCase()))
                    .map((log, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">{log.date}</TableCell>
                        <TableCell className="text-sm">{log.server}</TableCell>
                        <TableCell className="text-sm">{log.user}</TableCell>
                        <TableCell className="text-sm">{log.moderator}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              log.action === "ban"
                                ? "bg-destructive/20 text-destructive"
                                : log.action === "kick"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{log.reason}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="blacklist" className="space-y-6">
          <Tabs defaultValue="servers">
            <TabsList>
              <TabsTrigger value="servers">Servers ({blacklistedServers.length})</TabsTrigger>
              <TabsTrigger value="users">Users ({blacklistedUsers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="servers">
              <Card className="p-6">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Server</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blacklistedServers.map((server) => (
                        <TableRow key={server.id}>
                          <TableCell className="font-medium">{server.name}</TableCell>
                          <TableCell className="text-sm">{server.reason}</TableCell>
                          <TableCell className="text-sm">{server.date}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blacklistedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell className="text-sm">{user.reason}</TableCell>
                          <TableCell className="text-sm">{user.date}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
