"use client";

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
import {
  ChefHat,
  Plus,
  Calendar,
  Heart,
  Target,
  TrendingUp,
  Trophy,
  Award,
  Star,
  Flame,
  Share2,
  User,
  UtensilsCrossed,
  Binoculars,
  Home,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RequireAuth from "@/components/RequireAuth"
import { useMyFavorites } from "@/lib/useMyFavorites"
import React, { useState } from "react";

export default function HomePage() {
  const [selectedRoutine, setSelectedRoutine] =
    React.useState<"maintain" | "lose" | "gain" | null>(null)

  const [experienceLevel, setExperienceLevel] =
    useState<"beginner" | "advanced" | "professional" | null>(null)
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
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

  const routineTypes = {
    maintain: {
      title: "Maintain",
      description: "Keep your current weight and build healthy habits",
      icon: "⚖️",
      calories: 2200,
      protein: 165,
      carbs: 275,
      fats: 73,
      color: "blue",
    },
    lose: {
      title: "Lose",
      description: "Create a calorie deficit to lose weight sustainably",
      icon: "📉",
      calories: 1800,
      protein: 180,
      carbs: 180,
      fats: 60,
      color: "rose",
    },
    gain: {
      title: "Gain",
      description: "Build muscle with a calorie surplus and high protein",
      icon: "📈",
      calories: 2800,
      protein: 210,
      carbs: 350,
      fats: 93,
      color: "green",
    },
  }

  const currentRoutine = selectedRoutine ? routineTypes[selectedRoutine] : null

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const canSave = !!selectedRoutine && !!experienceLevel;

  // ← NUEVO: traemos favoritos reales (3 más recientes)
  const { data: favorites = [], loading: favLoading, error: favError } = useMyFavorites(3, 1)

  return (
    <RequireAuth>
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

          {/* Routine Type Selection Card */}
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Personal Information</h3>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Help us calculate your personalized nutrition targets based on your body metrics and fitness level
                </p>

              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              {/* Personal Stats Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">
                    Age (years)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Experience Level Selection */}
              <div className="space-y-3 border-b border-border pb-6 mb-8">
                <Label className="text-sm font-medium">Experience Level</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setExperienceLevel("beginner")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "beginner"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Beginner</h4>
                      {experienceLevel === "beginner" && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">New to fitness and nutrition tracking</p>
                  </button>

                  <button
                    onClick={() => setExperienceLevel("advanced")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "advanced"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Advanced</h4>
                      {experienceLevel === "advanced" && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Regular training with good knowledge</p>
                  </button>

                  <button
                    onClick={() => setExperienceLevel("professional")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "professional"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Professional</h4>
                      {experienceLevel === "professional" && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Athlete or fitness professional</p>
                  </button>
                </div>
              </div>

              {/* Your Fitness Goal */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">Your Fitness Goal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose your routine type and complete your profile for personalized nutrition targets
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Maintain Option */}
                  <button
                    onClick={() => setSelectedRoutine("maintain")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "maintain"
                      ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                      : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{routineTypes.maintain.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{routineTypes.maintain.title}</h3>
                        {selectedRoutine === "maintain" && <Badge className="bg-blue-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{routineTypes.maintain.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Daily Calories:</span>
                        <span className="font-medium text-foreground">{routineTypes.maintain.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium text-foreground">{routineTypes.maintain.protein}g</span>
                      </div>
                    </div>
                  </button>

                  {/* Lose Option */}
                  <button
                    onClick={() => setSelectedRoutine("lose")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "lose"
                      ? "border-rose-500 bg-rose-50 shadow-lg scale-105"
                      : "border-border hover:border-rose-300 hover:bg-rose-50/50"
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{routineTypes.lose.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{routineTypes.lose.title}</h3>
                        {selectedRoutine === "lose" && <Badge className="bg-rose-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{routineTypes.lose.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Daily Calories:</span>
                        <span className="font-medium text-foreground">{routineTypes.lose.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium text-foreground">{routineTypes.lose.protein}g</span>
                      </div>
                    </div>
                  </button>

                  {/* Gain Option */}
                  <button
                    onClick={() => setSelectedRoutine("gain")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "gain"
                      ? "border-green-500 bg-green-50 shadow-lg scale-105"
                      : "border-border hover:border-green-300 hover:bg-green-50/50"
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{routineTypes.gain.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{routineTypes.gain.title}</h3>
                        {selectedRoutine === "gain" && <Badge className="bg-green-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{routineTypes.gain.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Daily Calories:</span>
                        <span className="font-medium text-foreground">{routineTypes.gain.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium text-foreground">{routineTypes.gain.protein}g</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    className="w-full sm:w-auto"
                    disabled={!canSave}>
                    Save Profile Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Favorites Section */}
          <Card className="mb-8">
            <CardHeader className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" style={{ color: "#FF9800" }} />
                  <div>
                    <CardTitle>Favorite Recipes</CardTitle>
                    <CardDescription>Your most loved meal recipes</CardDescription>
                  </div>
                </div>
                <Link href="/recipes?tab=fav">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View your favorites
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {favLoading && (
                <div className="text-sm text-muted-foreground">Loading favorites…</div>
              )}
              {favError && (
                <div className="text-sm text-red-600">Error loading favorites</div>
              )}

              {!favLoading && !favError && (
                <>
                  {favorites.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <CardTitle className="mb-2">No favorites yet</CardTitle>
                        <CardDescription>
                          Add recipes to your favorites to see them here.
                        </CardDescription>
                        <div className="mt-4">
                          <Link href="/discover">
                            <Button>Discover recipes</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((r: any) => (
                        <Link key={r.id} href={`/recipes/${r.id}`}>
                          <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground line-clamp-1">{r.title}</h4>
                              {/* Si querés categoría, podrías usar un Badge con r.visibility o similar */}
                              <Badge variant="secondary" className="capitalize">
                                {r.visibility}
                              </Badge>
                            </div>
                            {r.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {r.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{Math.round(r.calories ?? 0)} cal</span>
                              <span>{Math.round(r.protein ?? 0)}g protein</span>
                              <span>{Math.round(r.carbs ?? 0)}g carbs</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Create New Recipe */}
            <Link href="/recipes/create">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
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
                <CardHeader className="pt-4">
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

            {/* Discover */}
            <Link href="/discover">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <Binoculars className="h-6 w-6" style={{ color: "#FF9800" }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Discover new recipes</CardTitle>
                      <CardDescription>Explore recipes from around the world</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Discover
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pt-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" style={{ color: "#FF9800" }} />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
              <CardHeader className="pt-4">
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
        </div>
      </div>
    </RequireAuth>
  )
}
