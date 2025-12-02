"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import {
  Bot,
  Shield,
  Coins,
  TrendingUp,
  Music,
  Sparkles,
  Users,
  Server,
  Code,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "300+ Commands",
    description: "Comprehensive command library covering moderation, fun, utility, and more.",
  },
  {
    icon: Shield,
    title: "Advanced Moderation",
    description: "Auto-mod, custom filters, warning system, and detailed logging.",
  },
  {
    icon: Coins,
    title: "Economy System",
    description: "Virtual currency, shop, trading, gambling, and daily rewards.",
  },
  {
    icon: TrendingUp,
    title: "Leveling & XP",
    description: "Engage members with XP tracking, level roles, and leaderboards.",
  },
  {
    icon: Music,
    title: "Music Player",
    description: "High-quality music streaming from YouTube, Spotify, and more.",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    description: "ChatGPT-powered responses, image generation, and smart replies.",
  },
]

const commandCategories = [
  {
    name: "Moderation",
    commands: ["ban", "kick", "mute", "warn", "purge", "slowmode", "lock", "unlock"],
  },
  {
    name: "Economy",
    commands: ["balance", "daily", "work", "shop", "buy", "sell", "trade", "gamble"],
  },
  {
    name: "Leveling",
    commands: ["rank", "leaderboard", "setxp", "addxp", "removexp"],
  },
  {
    name: "Music",
    commands: ["play", "pause", "skip", "queue", "volume", "loop", "lyrics"],
  },
  {
    name: "Fun",
    commands: ["meme", "8ball", "joke", "roast", "compliment", "trivia", "truth", "dare"],
  },
  {
    name: "Utility",
    commands: ["help", "serverinfo", "userinfo", "avatar", "poll", "remind", "translate"],
  },
]

export default function HomePage() {
  const [stats, setStats] = useState({ totalServers: 0, totalUsers: 0, totalCommands: 300 })
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    api.getBotStats().then((response) => {
      if (response.success && response.data) {
        setStats(response.data)
      }
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-background animate-gradient opacity-30" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 animate-float"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                QuantumX Bot
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance">
              The Most Advanced Discord Bot with 300+ Commands
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your Discord server with powerful moderation, engaging economy, leveling system, music player,
              and AI-powered features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-8">
                  Add to Discord
                </Button>
              </a>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:scale-105 transition-transform">
              <Server className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">{stats.totalServers.toLocaleString()}</div>
              <div className="text-muted-foreground">Active Servers</div>
            </Card>
            <Card className="p-8 text-center hover:scale-105 transition-transform">
              <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <div className="text-4xl font-bold mb-2">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-muted-foreground">Total Users</div>
            </Card>
            <Card className="p-8 text-center hover:scale-105 transition-transform">
              <Code className="w-12 h-12 mx-auto mb-4 text-accent" />
              <div className="text-4xl font-bold mb-2">{stats.totalCommands}+</div>
              <div className="text-muted-foreground">Commands Available</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and grow your Discord community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg hover:scale-105 transition-all">
                  <Icon className="w-12 h-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commands Preview Section */}
      <section id="commands" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Command Categories</h2>
            <p className="text-xl text-muted-foreground">Browse our extensive library of commands</p>
          </div>

          <div className="space-y-4">
            {commandCategories.map((category) => (
              <Card key={category.name} className="overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.commands.length} commands</p>
                    </div>
                  </div>
                  {expandedCategory === category.name ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>

                {expandedCategory === category.name && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {category.commands.map((command) => (
                        <span key={command} className="px-3 py-1 rounded-full bg-muted text-sm font-mono">
                          /{command}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              View All Commands
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden p-12 md:p-20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of servers using QuantumX to create amazing Discord experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="text-lg px-8">
                    Add to Discord Now
                  </Button>
                </a>
                <a href={process.env.NEXT_PUBLIC_DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                    Join Support Server
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
