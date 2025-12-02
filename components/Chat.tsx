"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Send, UsersIcon, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  userId: string
  username: string
  avatar?: string
  message: string
  timestamp: string
}

interface OnlineUser {
  id: string
  username: string
  avatar?: string
}

export function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    loadOnlineUsers()

    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      loadMessages(true)
      loadOnlineUsers()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async (silent = false) => {
    try {
      const token = localStorage.getItem("quantumx_token")
      if (!token) return

      const response = await api.getChatMessages(token, 50, 0)

      if (response.success && response.data) {
        setMessages(response.data)
      }
    } catch (error) {
      if (!silent) {
        console.error("[v0] Failed to load messages:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadOnlineUsers = async () => {
    try {
      const token = localStorage.getItem("quantumx_token")
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/online`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setOnlineUsers(data.data || [])
      }
    } catch (error) {
      // Silent fail for online users
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    if (newMessage.length > 500) {
      toast.error("Message is too long (max 500 characters)")
      return
    }

    setIsSending(true)

    try {
      const token = localStorage.getItem("quantumx_token")
      if (!token) return

      const response = await api.sendChatMessage(token, newMessage.trim())

      if (response.success) {
        setNewMessage("")
        loadMessages(true)
      } else {
        toast.error(response.error || "Failed to send message")
      }
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Online Users Sidebar */}
      <Card className="p-4 lg:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Online ({onlineUsers.length})</h3>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={onlineUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{onlineUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">{onlineUser.username}</span>
                <div className="ml-auto h-2 w-2 rounded-full bg-success" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="p-6 lg:col-span-3">
        <div className="flex flex-col h-[500px]">
          <div className="mb-4">
            <h3 className="text-xl font-bold">Community Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with other QuantumX users</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
            <div className="space-y-4 pr-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.userId === user?.id ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{message.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${message.userId === user?.id ? "text-right" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.userId === user?.id ? (
                          <>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                            <span className="font-medium text-sm">{message.username}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-sm">{message.username}</span>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                          </>
                        )}
                      </div>
                      <div
                        className={`inline-block px-4 py-2 rounded-lg ${
                          message.userId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm break-words">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending || !newMessage.trim()}>
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">{newMessage.length}/500 characters</p>
        </div>
      </Card>
    </div>
  )
}
