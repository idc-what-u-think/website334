// API Client for Cloudflare Workers integration

interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class APIClient {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ""
    this.apiKey = process.env.API_KEY || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<APIResponse<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Request failed",
      }
    }
  }

  // Auth APIs
  async googleAuth(code: string) {
    return this.request<{ token: string; user: any }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  }

  async getCurrentUser(token: string) {
    return this.request("/api/auth/me", {}, token)
  }

  async updateUsername(token: string, username: string) {
    return this.request(
      "/api/users/username",
      {
        method: "PUT",
        body: JSON.stringify({ username }),
      },
      token,
    )
  }

  // Chat APIs
  async getChatMessages(token: string, limit = 50, offset = 0) {
    return this.request(`/api/chat/messages?limit=${limit}&offset=${offset}`, {}, token)
  }

  async sendChatMessage(token: string, message: string) {
    return this.request(
      "/api/chat/messages",
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
      token,
    )
  }

  // Public APIs
  async getBotStats() {
    return this.request<{ totalServers: number; totalUsers: number; totalCommands: number }>("/api/bot/stats")
  }

  // Admin APIs
  async adminLogin(username: string, password: string) {
    return this.request<{ token: string }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getAdminBotStats(adminToken: string) {
    return this.request("/api/admin/bot/stats", {}, adminToken)
  }

  async getServers(adminToken: string, limit = 50, offset = 0, search = "") {
    return this.request(`/api/admin/servers?limit=${limit}&offset=${offset}&search=${search}`, {}, adminToken)
  }

  async getUsers(adminToken: string, limit = 50, offset = 0, search = "") {
    return this.request(`/api/admin/users?limit=${limit}&offset=${offset}&search=${search}`, {}, adminToken)
  }

  async blacklistServer(adminToken: string, serverId: string, reason: string) {
    return this.request(
      "/api/admin/servers/blacklist",
      {
        method: "POST",
        body: JSON.stringify({ serverId, reason }),
      },
      adminToken,
    )
  }

  async blacklistUser(adminToken: string, userId: string, reason: string) {
    return this.request(
      "/api/admin/users/blacklist",
      {
        method: "POST",
        body: JSON.stringify({ userId, reason }),
      },
      adminToken,
    )
  }

  async getModerationLogs(adminToken: string, filters?: any) {
    return this.request(
      "/api/admin/moderation/logs",
      {
        method: "POST",
        body: JSON.stringify(filters || {}),
      },
      adminToken,
    )
  }

  async getCommandAnalytics(adminToken: string) {
    return this.request("/api/admin/commands/analytics", {}, adminToken)
  }

  async getAnalytics(adminToken: string, timeRange = "7d") {
    return this.request(`/api/admin/analytics?range=${timeRange}`, {}, adminToken)
  }
}

export const api = new APIClient()
