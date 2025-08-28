import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChefHat, Plus, Calendar, Heart, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Track your nutrition and reach your fitness goals</p>
        </div>

        {/* Daily Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,847</div>
              <div className="text-xs text-muted-foreground">of 2,200 goal</div>
              <Progress value={84} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">142g</div>
              <div className="text-xs text-muted-foreground">of 165g goal</div>
              <Progress value={86} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">203g</div>
              <div className="text-xs text-muted-foreground">of 275g goal</div>
              <Progress value={74} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">67g</div>
              <div className="text-xs text-muted-foreground">of 73g goal</div>
              <Progress value={92} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Create New Recipe */}
          <Link href="/recipes/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Create New Recipe</CardTitle>
                    <CardDescription>Build and save custom recipes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Add Meals */}
          <Link href="/meals/add">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Add Meals</CardTitle>
                    <CardDescription>Log your daily nutrition intake</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Meal
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Calendar */}
          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-3/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Calendar</CardTitle>
                    <CardDescription>View your nutrition timeline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Favorites Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Favorite Recipes</CardTitle>
                  <CardDescription>Your most loved meal recipes</CardDescription>
                </div>
              </div>
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                  View All Favorites
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sample favorite recipes */}
              <Link href="/recipes/1">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Protein Smoothie Bowl</h4>
                    <Badge variant="secondary">Breakfast</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">High protein, low carb</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>320 cal</span>
                    <span>25g protein</span>
                    <span>15g carbs</span>
                  </div>
                </div>
              </Link>

              <Link href="/recipes/2">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Grilled Chicken Salad</h4>
                    <Badge variant="secondary">Lunch</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Lean protein, fresh veggies</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>450 cal</span>
                    <span>35g protein</span>
                    <span>12g carbs</span>
                  </div>
                </div>
              </Link>

              <Link href="/recipes/3">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Quinoa Power Bowl</h4>
                    <Badge variant="secondary">Dinner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Complete amino acids</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>520 cal</span>
                    <span>18g protein</span>
                    <span>65g carbs</span>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Daily Calories</span>
                  <span className="font-medium">1,923</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Protein Goal Hit</span>
                  <span className="font-medium">5/7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recipes Created</span>
                  <span className="font-medium">3 this week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Added breakfast: Oatmeal with berries</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Created recipe: Veggie Stir Fry</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <span className="text-sm">Reached protein goal yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access to Meal Tracking */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Today's Nutrition</CardTitle>
                    <CardDescription>Quick access to your meal tracking</CardDescription>
                  </div>
                </div>
                <Link href="/meals">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    View Full Tracking
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/meals/add" className="w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </Link>
                <Link href="/recipes" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                    Browse Recipes
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
