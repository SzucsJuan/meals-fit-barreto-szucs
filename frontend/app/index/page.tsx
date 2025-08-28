import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Search,
  TrendingUp,
  Clock,
  Users,
  Star,
  ChefHat,
  Target,
  Calendar,
  Heart,
  BookOpen,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

// Sample index data
const featuredContent = [
  {
    id: 1,
    title: "High Protein Meal Plans",
    description: "Complete meal plans designed for muscle building and recovery",
    category: "Meal Plans",
    rating: 4.8,
    users: 1250,
    image: "/protein-smoothie-bowl-with-berries-and-granola.png",
  },
  {
    id: 2,
    title: "Quick 15-Minute Recipes",
    description: "Healthy recipes you can make in 15 minutes or less",
    category: "Recipes",
    rating: 4.9,
    users: 2100,
    image: "/greek-yogurt-parfait-with-berries-and-nuts.png",
  },
  {
    id: 3,
    title: "Macro Tracking Guide",
    description: "Complete guide to tracking macronutrients effectively",
    category: "Guides",
    rating: 4.7,
    users: 890,
    image: "/quinoa-power-bowl-with-roasted-vegetables.png",
  },
]

const categories = [
  { name: "Recipes", icon: ChefHat, count: 150, color: "text-primary" },
  { name: "Meal Plans", icon: Utensils, count: 45, color: "text-accent" },
  { name: "Nutrition Guides", icon: BookOpen, count: 32, color: "text-chart-3" },
  { name: "Workout Plans", icon: Target, count: 28, color: "text-chart-5" },
  { name: "Success Stories", icon: Star, count: 67, color: "text-primary" },
  { name: "Tools & Calculators", icon: Calendar, count: 15, color: "text-accent" },
]

const popularResources = [
  { title: "BMR Calculator", description: "Calculate your daily calorie needs", views: "12.5k" },
  { title: "Macro Calculator", description: "Find your optimal macro split", views: "8.9k" },
  { title: "Meal Prep Templates", description: "Weekly meal prep planning sheets", views: "15.2k" },
  { title: "Grocery Shopping Lists", description: "Organized lists by dietary goals", views: "6.7k" },
  { title: "Progress Tracking Sheets", description: "Track your fitness journey", views: "9.3k" },
]

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Resource Index</h1>
          </div>
          <p className="text-muted-foreground">
            Discover recipes, guides, tools, and resources for your nutrition journey
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search recipes, guides, meal plans, and more..." className="pl-12 h-12 text-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <category.icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                  <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Featured Content</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                  <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90">
                    {item.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {item.users.toLocaleString()} users
                    </div>
                  </div>
                  <Button className="w-full">View Content</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Resources */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">Popular Resources</h2>
            <div className="space-y-4">
              {popularResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        {resource.views} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/recipes">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Browse Recipes
                  </Button>
                </Link>
                <Link href="/meals">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Track Meals
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    My Favorites
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-foreground">New Recipe Collection</div>
                  <div className="text-muted-foreground">25 Mediterranean recipes added</div>
                  <div className="text-xs text-muted-foreground">2 days ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Macro Calculator Update</div>
                  <div className="text-muted-foreground">Enhanced accuracy and new features</div>
                  <div className="text-xs text-muted-foreground">1 week ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Meal Prep Guide</div>
                  <div className="text-muted-foreground">Complete beginner's guide published</div>
                  <div className="text-xs text-muted-foreground">2 weeks ago</div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Recipes</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-medium">15,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meals Logged</span>
                  <span className="font-medium">89,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Stories</span>
                  <span className="font-medium">2,156</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
