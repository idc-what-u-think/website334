"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Search, Eye, Ban, ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [page, search])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("quantumx_admin_token")
      if (!token) return

      const response = await api.getUsers(token, 50, (page - 1) * 50, search)

      if (response.success && response.data) {
        setUsers(response.data.users || [])
        setTotalPages(Math.ceil((response.data.total || 0) / 50))
      }
    } catch (error) {
      console.error("[v0] Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProfile = (user: any) => {
    setSelectedUser(user)
    setDetailsOpen(true)
  }

  const handleBlacklist = async (userId: string) => {
    const reason = prompt("Enter reason for blacklisting:")
    if (!reason) return

    const token = localStorage.getItem("quantumx_admin_token")
    if (!token) return

    toast.promise(api.blacklistUser(token, userId, reason), {
      loading: "Blacklisting user...",
      success: "User blacklisted successfully",
      error: "Failed to blacklist user",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage all users across servers</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by username or email..."
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
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Servers</TableHead>
                    <TableHead>Commands Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.username || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email || "N/A"}</TableCell>
                      <TableCell>{user.serverCount || 0}</TableCell>
                      <TableCell>{user.commandsUsed?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewProfile(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleBlacklist(user.id)}>
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

      {/* User Profile Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser?.username || "User Profile"}</DialogTitle>
            <DialogDescription>User information and statistics</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedUser.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Servers</p>
                  <p>{selectedUser.serverCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commands Used</p>
                  <p>{selectedUser.commandsUsed?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p>{selectedUser.totalXP?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p>{selectedUser.totalBalance?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset XP
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Economy
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
