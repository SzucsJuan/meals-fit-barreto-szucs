"use client"

import Link from "next/link"
import Image from "next/image"
import { authApi } from "@/lib/api"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  ChefHat,
  Target,
  Calendar,
  Heart,
  Menu,
  LogOut,
  LogIn,
  UserPlus,
  Binoculars,
  Shield,
} from "lucide-react"

type UserDTO = {
  id: number
  name: string
  email: string
  role?: "user" | "admin" | string
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserDTO | null>(null)
  const [checking, setChecking] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const me = await authApi.me()
        if (mounted) setUser(me)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setChecking(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await authApi.logout()
      setUser(null)
      router.push("/signin")
    } catch (e) {
      console.error(e)
    } finally {
      setLoggingOut(false)
      setMobileMenuOpen(false)
    }
  }

  const NavigationLinks = ({
    mobile = false,
    onLinkClick = () => {},
  }: {
    mobile?: boolean
    onLinkClick?: () => void
  }) => (
    <>
      <Link href="/home" onClick={onLinkClick}>
        <Button
          variant={isActive("/home") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Home className="h-4 w-4" />
          Home
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
      <Link href="/recipes" onClick={onLinkClick}>
        <Button
          variant={isActive("/recipes") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <ChefHat className="h-4 w-4" />
          My Recipes
        </Button>
      </Link>
      <Link href="/discover" onClick={onLinkClick}>
        <Button
          variant={isActive("/discover") ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
        >
          <Binoculars className="h-4 w-4" />
          Discover
        </Button>
      </Link>

      {/* 👉 Admin Panel solo si el user es admin */}
      {user?.role === "admin" && (
        <Link href="/admin" onClick={onLinkClick}>
          <Button
            variant={isActive("/admin") ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${mobile ? "w-full justify-start" : ""}`}
          >
            <Shield className="h-4 w-4" />
            Admin Panel
          </Button>
        </Link>
      )}
    </>
  )

  // Botonera derecha (Auth)
  const AuthButtons = ({
    mobile = false,
    onLinkClick = () => {},
  }: {
    mobile?: boolean
    onLinkClick?: () => void
  }) => {
    if (checking) {
      return (
        <div className={`${mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}`}>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className={`${mobile ? "w-full justify-start" : ""}`}
          >
            ...
          </Button>
        </div>
      )
    }

    if (user) {
      return (
        <div className={`${mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}`}>
          <span className={`text-sm text-muted-foreground ${mobile ? "px-2" : ""}`}>
            {user.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`${mobile ? "w-full justify-start" : ""}`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )
    }

    return (
      <div className={`${mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}`}>
        <Link href="/signin" onClick={onLinkClick}>
          <Button
            variant="ghost"
            size="sm"
            className={`${mobile ? "w-full justify-start" : ""}`}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign in
          </Button>
        </Link>
        <Link href="/signup" onClick={onLinkClick}>
          <Button size="sm" className={`${mobile ? "w-full justify-start" : ""}`}>
            <UserPlus className="h-4 w-4 mr-2" />
            Sign up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/icon/logo.png" alt="MealsFit Logo" width={32} height={32} />
            <h1 className="text-xl font-bold text-foreground">Meals&amp;Fit</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationLinks />
          </div>

          {/* Desktop Right (Auth) */}
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
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
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                      MAIN MENU
                    </h3>
                    <NavigationLinks
                      mobile
                      onLinkClick={() => setMobileMenuOpen(false)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                      ACCOUNT
                    </h3>
                    <AuthButtons
                      mobile
                      onLinkClick={() => setMobileMenuOpen(false)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
