import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Apple, Target, TrendingUp, Award } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-12">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance text-foreground">Start your transformation today</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Join thousands of users who are achieving their health and fitness goals with smart nutrition tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Track Goals</h3>
              <p className="text-xs text-muted-foreground">Monitor your daily nutrition targets</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">See Progress</h3>
              <p className="text-xs text-muted-foreground">Visualize your health journey</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Award className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Earn Rewards</h3>
              <p className="text-xs text-muted-foreground">Unlock achievements</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Apple className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Custom Recipes</h3>
              <p className="text-xs text-muted-foreground">Create your meal plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="space-y-2 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Apple className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Meals&Fit</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Get started for free</CardTitle>
              <CardDescription>No credit card required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign Up */}
              <Button variant="outline" className="w-full h-11 bg-transparent" size="lg">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" type="text" placeholder="John Doe" className="h-11" required />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" className="h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Passwords must match</p>
                </div>

                <Button type="submit" className="w-full h-11" size="lg">
                  Create account
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
