"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  // Don't show footer on authentication pages
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/forgot-password")

  if (isAuthPage) {
    return null
  }

  return <Footer />
}
