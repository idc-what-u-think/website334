"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Search, Eye, Ban, ChevronLeft, ChevronRight } from "lucide-react"

export default function AdminServersPage() {
  const [servers, setServers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedServer, setSelectedServer] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    loadServers()
  }, [page, search])

  const loadServers = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const response = await api.getServers(token, 50, (page - 1) * 50, search)

      if (response.success && response.data) {
        setServers(response.data.servers || [])
        setTotalPages(Math.ceil((response.data.total || 0) / 50))
      }
    } catch (error) {
      console.error("[v0] Failed to load servers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (server: any) => {
    setSelectedServer(server)
    setDetailsOpen(true)
  }

  const handleBlacklist = async (serverId: string) => {
    const reason = prompt("Enter reason for blacklisting:")
    if (!reason) return

    const token = localStorage.getItem("quantumx_admin_token")
    if (!token) return

    toast.promise(api.blacklistServer(token, serverId, reason), {
      loading: "Blacklisting server...",
      success: "Server blacklisted successfully",
      error: "Failed to blacklist server",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Server Management</h1>
        <p className="text-muted-foreground">Manage all servers using QuantumX Bot</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">{server.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium">{server.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{server.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{server.memberCount?.toLocaleString() || "N/A"}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{server.prefix || "!"}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{server.createdAt || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewDetails(server)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleBlacklist(server.id)}>
                            <Ban className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Server Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedServer?.name}</DialogTitle>
            <DialogDescription>Server configuration and details</DialogDescription>
          </DialogHeader>

          {selectedServer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Server ID</p>
                  <p className="font-mono text-sm">{selectedServer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p>{selectedServer.memberCount?.toLocaleString() || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prefix</p>
                  <p className="font-mono">{selectedServer.prefix || "!"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p>{selectedServer.createdAt || "N/A"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Active Features</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Leveling System</span>
                    <span className="text-sm text-success">Enabled</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Economy System</span>
                    <span className="text-sm text-success">Enabled</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Auto Moderation</span>
                    <span className="text-sm text-success">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
