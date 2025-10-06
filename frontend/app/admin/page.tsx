"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, ChefHat, FileText, TrendingUp, AlertCircle, CheckCircle, Clock, Activity } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const statsData = [
  { name: "Mon", users: 45, recipes: 12, meals: 234 },
  { name: "Tue", users: 52, recipes: 15, meals: 267 },
  { name: "Wed", users: 48, recipes: 18, meals: 289 },
  { name: "Thu", users: 61, recipes: 14, meals: 312 },
  { name: "Fri", users: 55, recipes: 20, meals: 298 },
  { name: "Sat", users: 67, recipes: 25, meals: 345 },
  { name: "Sun", users: 58, recipes: 22, meals: 321 },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Shield className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your nutrition and fitness platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">1,247</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12%</span> from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Total Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">3,892</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+8%</span> from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Meals Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">18,456</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+15%</span> from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">127</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+5%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-rose-200 dark:border-rose-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription className="text-xs">Manage user accounts</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/recipes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-pink-200 dark:border-pink-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <ChefHat className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Recipe Management</CardTitle>
                    <CardDescription className="text-xs">Moderate recipes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/content">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Content Management</CardTitle>
                    <CardDescription className="text-xs">Upload documents</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-rose-200 dark:border-rose-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Analytics</CardTitle>
                    <CardDescription className="text-xs">View insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User registrations and recipe creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#ec4899" name="New Users" />
                    <Bar dataKey="recipes" fill="#be123c" name="New Recipes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Logging Trend</CardTitle>
              <CardDescription>Daily meal entries over the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="meals" stroke="#ec4899" strokeWidth={2} name="Meals Logged" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com • 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Recipe published</p>
                    <p className="text-xs text-muted-foreground">
                      "Healthy Breakfast Bowl" by Sarah M. • 12 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Recipe flagged for review</p>
                    <p className="text-xs text-muted-foreground">"Quick Snack Ideas" • 25 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Document uploaded</p>
                    <p className="text-xs text-muted-foreground">"Nutrition Guidelines 2024.pdf" • 1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">3 Recipes awaiting approval</p>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    >
                      Pending
                    </Badge>
                  </div>
                  <Link href="/admin/recipes?filter=pending">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Review Recipes
                    </Button>
                  </Link>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">2 User reports to review</p>
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                    >
                      Urgent
                    </Badge>
                  </div>
                  <Link href="/admin/users?filter=reported">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      View Reports
                    </Button>
                  </Link>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">5 New community posts</p>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      New
                    </Badge>
                  </div>
                  <Link href="/admin/content?filter=community">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Moderate Posts
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Frequently accessed admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link href="/admin/users/new">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Add User
                  </Button>
                </Link>
                <Link href="/admin/recipes/new">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Add Recipe
                  </Button>
                </Link>
                <Link href="/admin/content/upload">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Upload Doc
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Reports
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Settings
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Back to App
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
