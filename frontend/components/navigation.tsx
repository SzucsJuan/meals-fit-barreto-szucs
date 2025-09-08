"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, Home, Users, Apple, ChefHat, Target, Calendar, Heart, Menu } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const NavigationLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link href="/" onClick={onLinkClick}>
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/recipes" onClick={onLinkClick}>
        <Button
          variant={isActive("/recipes") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <ChefHat className="h-4 w-4" />
          Recipes
        </Button>
      </Link>
      <Link href="/meals" onClick={onLinkClick}>
        <Button
          variant={isActive("/meals") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Target className="h-4 w-4" />
          Meals
        </Button>
      </Link>
      <Link href="/calendar" onClick={onLinkClick}>
        <Button
          variant={isActive("/calendar") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </Button>
      </Link>
      <Link href="/favorites" onClick={onLinkClick}>
        <Button
          variant={isActive("/favorites") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Heart className="h-4 w-4" />
          Favorites
        </Button>
      </Link>
    </>
  )

  const SecondaryLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link href="/chat" onClick={onLinkClick}>
        <Button
          variant={isActive("/chat") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </Link>
      {/* <Link href="/index" onClick={onLinkClick}>
        <Button
          variant={isActive("/index") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Home className="h-4 w-4" />
          Index
        </Button>
      </Link> */}
      <Link href="/community" onClick={onLinkClick}>
        <Button
          variant={isActive("/community") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Users className="h-4 w-4" />
          Community
        </Button>
      </Link>
    </>
  )

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Apple className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Meals&amp;Fit</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationLinks />
          </div>

          {/* Desktop Secondary Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <SecondaryLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">MAIN MENU</h3>
                    <NavigationLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">MORE</h3>
                    <SecondaryLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tablet Navigation - Show secondary links only */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <SecondaryLinks />
          </div>
        </div>
      </div>
    </nav>
  )
}
