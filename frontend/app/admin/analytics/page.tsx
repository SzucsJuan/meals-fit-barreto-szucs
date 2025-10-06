"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, ChefHat, Activity, Calendar, ArrowLeft, Download, TrendingDown } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"

// Sample analytics data
const userGrowthData = [
  { month: "Jul", users: 823, active: 645 },
  { month: "Aug", users: 912, active: 723 },
  { month: "Sep", users: 1045, active: 834 },
  { month: "Oct", users: 1123, active: 901 },
  { month: "Nov", users: 1198, active: 967 },
  { month: "Dec", users: 1247, active: 1012 },
]

const recipeActivityData = [
  { day: "Mon", created: 12, viewed: 234, favorited: 45 },
  { day: "Tue", created: 15, viewed: 267, favorited: 52 },
  { day: "Wed", created: 18, viewed: 289, favorited: 48 },
  { day: "Thu", created: 14, viewed: 312, favorited: 61 },
  { day: "Fri", created: 20, viewed: 298, favorited: 55 },
  { day: "Sat", created: 25, viewed: 345, favorited: 67 },
  { day: "Sun", created: 22, viewed: 321, favorited: 58 },
]

const mealLoggingData = [
  { time: "6AM", meals: 45 },
  { time: "9AM", meals: 123 },
  { time: "12PM", meals: 234 },
  { time: "3PM", meals: 89 },
  { time: "6PM", meals: 267 },
  { time: "9PM", meals: 156 },
]

const categoryDistribution = [
  { name: "Breakfast", value: 892, color: "#ec4899" },
  { name: "Lunch", value: 1234, color: "#be123c" },
  { name: "Dinner", value: 1456, color: "#475569" },
  { name: "Snacks", value: 310, color: "#f472b6" },
]

const topRecipes = [
  { name: "Protein Smoothie Bowl", views: 1247, favorites: 89, author: "Sarah J." },
  { name: "Grilled Chicken Salad", views: 892, favorites: 67, author: "Mike C." },
  { name: "Quinoa Power Bowl", views: 756, favorites: 54, author: "Emma D." },
  { name: "Greek Yogurt Parfait", views: 623, favorites: 43, author: "John S." },
  { name: "Avocado Toast", views: 589, favorites: 38, author: "Lisa M." },
]

const topUsers = [
  { name: "Sarah Johnson", recipes: 34, meals: 567, engagement: 95 },
  { name: "Mike Chen", recipes: 28, meals: 489, engagement: 88 },
  { name: "Emma Davis", recipes: 25, meals: 423, engagement: 82 },
  { name: "John Smith", recipes: 22, meals: 398, engagement: 76 },
  { name: "Lisa Martinez", recipes: 19, meals: 356, engagement: 71 },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("week")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics & Insights</h1>
                <p className="text-muted-foreground">Platform performance and user engagement metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={timeRange === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={timeRange === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
                <Button
                  variant={timeRange === "year" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange("year")}
                >
                  Year
                </Button>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
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
                <span className="text-green-600">+12.5%</span> vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">1,012</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+8.3%</span> vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Recipes Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">126</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-rose-600" />
                <span className="text-rose-600">-3.2%</span> vs last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Meals Logged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2,266</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+15.7%</span> vs last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Growth Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Total users and active users over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stackId="1"
                    stroke="#ec4899"
                    fill="#ec4899"
                    name="Total Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stackId="2"
                    stroke="#be123c"
                    fill="#be123c"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Activity & Meal Logging */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Activity</CardTitle>
              <CardDescription>Weekly recipe creation, views, and favorites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recipeActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="created" fill="#ec4899" name="Created" />
                    <Bar dataKey="viewed" fill="#be123c" name="Viewed" />
                    <Bar dataKey="favorited" fill="#475569" name="Favorited" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Logging Pattern</CardTitle>
              <CardDescription>Meals logged by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mealLoggingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="meals" stroke="#ec4899" strokeWidth={2} name="Meals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution & Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Category Distribution</CardTitle>
              <CardDescription>Breakdown of recipes by meal type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryDistribution.map((category) => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm text-muted-foreground">
                      {category.name} ({category.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Recipes</CardTitle>
              <CardDescription>Most viewed and favorited recipes this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRecipes.map((recipe, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium text-sm">{recipe.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">by {recipe.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{recipe.views} views</div>
                      <div className="text-xs text-muted-foreground">{recipe.favorites} favorites</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Users & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Most active users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.recipes} recipes • {user.meals} meals
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{user.engagement}%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">User Retention Rate</span>
                  <div className="text-right">
                    <span className="font-medium">81.2%</span>
                    <span className="text-xs text-green-600 ml-2">+2.3%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
                  <div className="text-right">
                    <span className="font-medium">12m 34s</span>
                    <span className="text-xs text-green-600 ml-2">+1m 12s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Recipe Approval Rate</span>
                  <div className="text-right">
                    <span className="font-medium">94.7%</span>
                    <span className="text-xs text-green-600 ml-2">+1.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Daily Active Users</span>
                  <div className="text-right">
                    <span className="font-medium">687</span>
                    <span className="text-xs text-green-600 ml-2">+45</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Community Engagement</span>
                  <div className="text-right">
                    <span className="font-medium">76.3%</span>
                    <span className="text-xs text-rose-600 ml-2">-2.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
