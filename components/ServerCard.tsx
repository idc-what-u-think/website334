"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Settings } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Server {
  id: string
  name: string
  icon?: string
  memberCount: number
  prefix?: string
}

export function ServerCard({ server }: { server: Server }) {
  const [configOpen, setConfigOpen] = useState(false)

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            {server.icon ? (
              <img src={server.icon || "/placeholder.svg"} alt={server.name} className="h-16 w-16 rounded-xl" />
            ) : (
              <span className="text-2xl font-bold text-white">{server.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 truncate">{server.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="w-4 h-4" />
              <span>{server.memberCount.toLocaleString()} members</span>
            </div>
            <Button onClick={() => setConfigOpen(true)} size="sm" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{server.name} Configuration</DialogTitle>
            <DialogDescription>Manage bot settings for this server</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Server Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Server ID</p>
                  <p className="font-mono">{server.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Members</p>
                  <p>{server.memberCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prefix</p>
                  <p className="font-mono">{server.prefix || "!"}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Leveling System</span>
                  <span className="text-success">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Economy System</span>
                  <span className="text-success">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Auto Moderation</span>
                  <span className="text-success">Enabled</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setConfigOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
