import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Home, ChefHat, Plus, Calendar, Heart, Target, TrendingUp, Trophy, Award, Star, Flame, Share2, Apple  } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

export default function HomePage() {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Log your first meal",
      icon: Target,
      unlocked: true,
      unlockedDate: "2024-01-15",
      category: "Getting Started",
    },
    {
      id: 2,
      title: "Recipe Creator",
      description: "Create your first custom recipe",
      icon: ChefHat,
      unlocked: true,
      unlockedDate: "2024-01-18",
      category: "Creativity",
    },
    {
      id: 3,
      title: "Protein Champion",
      description: "Hit your protein goal for 7 consecutive days",
      icon: Award,
      unlocked: true,
      unlockedDate: "2024-01-25",
      category: "Nutrition Goals",
    },
    {
      id: 4,
      title: "Streak Master",
      description: "Log meals for 30 consecutive days",
      icon: Flame,
      unlocked: false,
      progress: 23,
      total: 30,
      category: "Consistency",
    },
    {
      id: 5,
      title: "Recipe Collector",
      description: "Create 10 different recipes",
      icon: Star,
      unlocked: false,
      progress: 6,
      total: 10,
      category: "Creativity",
    },
    {
      id: 6,
      title: "Macro Master",
      description: "Hit all macro goals in a single day",
      icon: Trophy,
      unlocked: true,
      unlockedDate: "2024-01-20",
      category: "Nutrition Goals",
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground">What’s on your plate today?</p>
              </div>
            </div>
            {/* Achievements Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
                >
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700">Achievements</span>
                  <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
                    {unlockedCount}/{totalCount}
                  </Badge>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader className="pb-4">
                  <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    Your Achievements
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    You've unlocked {unlockedCount} out of {totalCount} achievements. Keep going to earn more trophies!
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
                  {["Getting Started", "Nutrition Goals", "Creativity", "Consistency"].map((category) => {
                    const categoryAchievements = achievements.filter((a) => a.category === category)
                    return (
                      <div key={category} className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">{category}</h3>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                          {categoryAchievements.map((achievement) => {
                            const IconComponent = achievement.icon
                            return (
                              <Card
                                key={achievement.id}
                                className={`${achievement.unlocked ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "opacity-60"}`}
                              >
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`p-2 rounded-lg flex-shrink-0 ${achievement.unlocked ? "bg-yellow-100" : "bg-muted"}`}
                                    >
                                      <IconComponent
                                        className={`h-5 w-5 sm:h-6 sm:w-6 ${achievement.unlocked ? "text-yellow-600" : "text-muted-foreground"}`}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1 gap-2">
                                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                          {achievement.title}
                                        </h4>
                                        {achievement.unlocked && (
                                          <Badge
                                            variant="secondary"
                                            className="bg-yellow-100 text-yellow-800 text-xs flex-shrink-0"
                                          >
                                            Unlocked
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                                        {achievement.description}
                                      </p>

                                      {achievement.unlocked ? (
                                        <div className="flex items-center justify-between gap-2">
                                          {/* <span className="text-xs text-muted-foreground truncate">
                                            Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                                          </span> */}
                                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs flex-shrink-0">
                                            <Share2 className="h-3 w-3 mr-1" />
                                            Share
                                          </Button>
                                        </div>
                                      ) : (
                                        achievement.progress !== undefined && (
                                          <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                              <span>Progress</span>
                                              <span>
                                                {achievement.progress}/{achievement.total}
                                              </span>
                                            </div>
                                            <Progress
                                              value={(achievement.progress / achievement.total) * 100}
                                              className="h-2"
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 sm:pt-6 border-t border-border">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-semibold text-sm sm:text-base text-foreground">Share Your Progress</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Let the community know about your achievements!
                      </p>
                    </div>
                    <Button className="w-full sm:w-auto sm:self-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share with Community
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

              {/* Favorites Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6" style={{ color: "#FF9800" }} />
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


        {/* Main Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Create New Recipe */}
          <Link href="/recipes/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <ChefHat className="h-6 w-6" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Create New Recipe</CardTitle>
                    <CardDescription>Build and save custom recipes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
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
                  <div className="p-2">
                    <Target className="h-6 w-6" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Add Meals</CardTitle>
                    <CardDescription>Log your daily nutrition intake</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
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
                  <div className="p-2">
                    <Calendar className="h-6 w-6" style={{ color: "#FF9800" }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Calendar</CardTitle>
                    <CardDescription>View your nutrition timeline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" style={{ color: "#FF9800" }} />
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
        {/* <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Apple className="h-6 w-6" style={{ color: "#FF9800" }} />
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
        </div> */}
      </div>
    </div>
  )
}
