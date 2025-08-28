"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Home, Users, Apple, ChefHat, Target, Calendar, Heart } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Apple className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">NutriTrack</h1>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/recipes">
              <Button
                variant={isActive("/recipes") ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <ChefHat className="h-4 w-4" />
                Recipes
              </Button>
            </Link>
            <Link href="/meals">
              <Button variant={isActive("/meals") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Meals
              </Button>
            </Link>
            <Link href="/calendar">
              <Button
                variant={isActive("/calendar") ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link href="/favorites">
              <Button
                variant={isActive("/favorites") ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Button>
            </Link>
          </div>

          {/* Secondary Navigation */}
          <div className="flex items-center gap-1">
            <Link href="/chat">
              <Button variant={isActive("/chat") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </Link>
            <Link href="/index">
              <Button variant={isActive("/index") ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Index
              </Button>
            </Link>
            <Link href="/community">
              <Button
                variant={isActive("/community") ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
