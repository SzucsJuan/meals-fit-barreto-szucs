"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Clock, Users, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

// Sample favorite recipes data
const favoriteRecipes = [
  {
    id: 1,
    name: "Protein Smoothie Bowl",
    description: "High protein breakfast bowl with berries and granola",
    image: "/protein-smoothie-bowl-with-berries-and-granola.png",
    prepTime: "10 min",
    servings: 1,
    calories: 320,
    protein: 25,
    carbs: 15,
    fats: 12,
    category: "Breakfast",
    difficulty: "Easy",
    dateAdded: "2024-01-10",
    timesUsed: 12,
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken and avocado",
    image: "/grilled-chicken-avocado-salad.png",
    prepTime: "25 min",
    servings: 2,
    calories: 450,
    protein: 35,
    carbs: 12,
    fats: 28,
    category: "Lunch",
    difficulty: "Medium",
    dateAdded: "2024-01-08",
    timesUsed: 8,
  },
  {
    id: 3,
    name: "Quinoa Power Bowl",
    description: "Nutrient-dense bowl with quinoa, roasted vegetables, and tahini",
    image: "/quinoa-power-bowl-with-roasted-vegetables.png",
    prepTime: "35 min",
    servings: 2,
    calories: 520,
    protein: 18,
    carbs: 65,
    fats: 22,
    category: "Dinner",
    difficulty: "Medium",
    dateAdded: "2024-01-05",
    timesUsed: 6,
  },
  {
    id: 4,
    name: "Greek Yogurt Parfait",
    description: "Layered parfait with Greek yogurt, honey, and nuts",
    image: "/greek-yogurt-parfait-with-berries-and-nuts.png",
    prepTime: "5 min",
    servings: 1,
    calories: 280,
    protein: 20,
    carbs: 25,
    fats: 8,
    category: "Snack",
    difficulty: "Easy",
    dateAdded: "2024-01-12",
    timesUsed: 15,
  },
  {
    id: 5,
    name: "Overnight Oats",
    description: "Creamy overnight oats with chia seeds and fresh fruit",
    image: "/overnight-oats-berries.png",
    prepTime: "5 min",
    servings: 1,
    calories: 350,
    protein: 12,
    carbs: 58,
    fats: 8,
    category: "Breakfast",
    difficulty: "Easy",
    dateAdded: "2024-01-14",
    timesUsed: 9,
  },
  {
    id: 6,
    name: "Salmon with Sweet Potato",
    description: "Baked salmon with roasted sweet potato and asparagus",
    image: "/baked-salmon-sweet-potato.png",
    prepTime: "30 min",
    servings: 1,
    calories: 480,
    protein: 35,
    carbs: 32,
    fats: 22,
    category: "Dinner",
    difficulty: "Medium",
    dateAdded: "2024-01-07",
    timesUsed: 5,
  },
]

// Sample favorite meal combinations
const favoriteMealCombos = [
  {
    id: 1,
    name: "High Protein Day",
    description: "Perfect for strength training days",
    meals: ["Protein Smoothie Bowl", "Grilled Chicken Salad", "Salmon with Sweet Potato"],
    totalCalories: 1250,
    totalProtein: 95,
    timesUsed: 4,
  },
  {
    id: 2,
    name: "Quick & Easy",
    description: "Minimal prep time meals",
    meals: ["Greek Yogurt Parfait", "Overnight Oats", "Quinoa Power Bowl"],
    totalCalories: 1150,
    totalProtein: 50,
    timesUsed: 7,
  },
]

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "name">("recent")

  const categories = ["all", "breakfast", "lunch", "dinner", "snack"]

  const filteredRecipes = favoriteRecipes
    .filter((recipe) => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || recipe.category.toLowerCase() === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.timesUsed - a.timesUsed
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      }
    })

  const handleRemoveFromFavorites = (recipeId: number) => {
    // Here you would typically update the database
    console.log("Removing recipe from favorites:", recipeId)
  }

  const totalFavorites = favoriteRecipes.length
  const avgCalories = Math.round(favoriteRecipes.reduce((sum, recipe) => sum + recipe.calories, 0) / totalFavorites)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
                <p className="text-muted-foreground">Your most loved recipes and meal combinations</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalFavorites}</div>
              <div className="text-xs text-muted-foreground">recipes saved</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgCalories}</div>
              <div className="text-xs text-muted-foreground">per recipe</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Most Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">15x</div>
              <div className="text-xs text-muted-foreground">Greek Yogurt Parfait</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">4</div>
              <div className="text-xs text-muted-foreground">meal types</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "name")}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="recent">Recently Added</option>
            <option value="popular">Most Used</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Favorite Recipes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Favorite Recipes</h2>
              <Badge variant="outline">{filteredRecipes.length} recipes</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleRemoveFromFavorites(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Badge variant="secondary" className="absolute bottom-2 left-2 bg-white/90">
                      {recipe.category}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <CardDescription className="text-sm">{recipe.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.prepTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                      </div>
                      <div className="text-primary font-medium">Used {recipe.timesUsed}x</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{recipe.calories}</div>
                        <div className="text-muted-foreground">cal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{recipe.protein}g</div>
                        <div className="text-muted-foreground">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{recipe.carbs}g</div>
                        <div className="text-muted-foreground">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{recipe.fats}g</div>
                        <div className="text-muted-foreground">fats</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/recipes/${recipe.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          View Recipe
                        </Button>
                      </Link>
                      <Link href="/meals/add">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Log
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No favorites found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filters"
                      : "Start adding recipes to your favorites to see them here"}
                  </p>
                  <Link href="/recipes">
                    <Button>Browse Recipes</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite Meal Combinations */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Combinations</CardTitle>
                <CardDescription>Your favorite daily meal plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {favoriteMealCombos.map((combo) => (
                  <div key={combo.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{combo.name}</h4>
                      <Badge variant="outline">{combo.timesUsed}x used</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>
                    <div className="space-y-1 mb-3">
                      {combo.meals.map((meal, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {meal}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-primary font-medium">{combo.totalCalories} cal</span>
                      <span className="text-accent font-medium">{combo.totalProtein}g protein</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/recipes">
                  <Button className="w-full bg-transparent" variant="outline">
                    Browse All Recipes
                  </Button>
                </Link>
                <Link href="/recipes/create">
                  <Button className="w-full bg-transparent" variant="outline">
                    Create New Recipe
                  </Button>
                </Link>
                <Link href="/meals/add">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Meal from Favorites
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Nutrition Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Popular Category</span>
                  <Badge variant="secondary">Breakfast</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Prep Time</span>
                  <span className="font-medium">18 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Protein Focus</span>
                  <span className="font-medium">68% high protein</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty Level</span>
                  <span className="font-medium">Mostly Easy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
