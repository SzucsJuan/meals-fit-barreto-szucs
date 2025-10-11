import Link from "next/link"
import Image from "next/image"
import { Heart, Mail, Instagram, Facebook } from "lucide-react"

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Meals", href: "/meals" },
  { label: "My Recipes", href: "/recipes" },
  { label: "Discover", href: "/discover" },
];

export function Footer() {
  return (
    <footer className="mt-16">
      {/* Sección principal */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-t">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-12 text-center md:text-left">
            
            <div className="space-y-6 max-w-sm mx-auto md:mx-0">
              <div className="space-y-3">
                <div className="flex justify-center md:justify-start items-center gap-3">
                  <Image src="/icon/logo.png" alt="MealsFit Logo" width={32} height={32}/>
                  <span className="font-bold text-2xl">Meals&Fit</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your personal nutrition and fitness companion. Track meals, discover recipes, and achieve your health goals.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Follow Us</p>
                <div className="flex justify-center md:justify-start gap-3">
                  <Link href="https://instagram.com" target="_blank" className="p-2.5 bg-background hover:bg-primary/10 border rounded-lg transition-all hover:scale-110 hover:border-primary/50">
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link href="https://facebook.com" target="_blank" className="p-2.5 bg-background hover:bg-primary/10 border rounded-lg transition-all hover:scale-110 hover:border-primary/50">
                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link href="https://x.com" target="_blank" className="p-2.5 bg-background hover:bg-primary/10 border rounded-lg transition-all hover:scale-110 hover:border-primary/50">
                    <svg className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col items-center md:items-center">
              <h3 className="font-semibold text-base">Navigation</h3>
              <ul className="space-y-3 text-sm">
                {navItems.map(({label, href}) => (
                  <li key={label}>
                    <Link href={href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 max-w-sm mx-auto md:mx-0">
              <h3 className="font-semibold text-base">Get in Touch</h3>
              <div className="space-y-3">
                <Link href="mailto:support@mealsfit.com" className="flex justify-center md:justify-start items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 bg-background border rounded-lg group-hover:border-primary/50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>support@mealsfit.com</span>
                </Link>
              </div>
              <div className="flex justify-center md:justify-start items-center gap-2 pt-4 px-4 py-3 bg-primary/5 rounded-lg border border-primary/10">
                <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">Made with love for your health</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-background border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-sm text-center md:text-left">
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Meals&Fit. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
