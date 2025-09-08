import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Plus, Search, Clock, Users, Heart } from "lucide-react"
import Link from "next/link"

// Sample recipe data
const recipes = [
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
    isFavorite: true,
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
    isFavorite: false,
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
    isFavorite: true,
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
    isFavorite: false,
  },
]

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Recipe Collection</h1>
                <p className="text-muted-foreground">Discover and create healthy recipes</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/favorites" className="w-full sm:w-auto">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent w-full sm:w-auto">
                  <Heart className="h-4 w-4" />
                  Favorites
                </Button>
              </Link>
              <Link href="/recipes/create" className="w-full sm:w-auto">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Create Recipe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters - Better mobile layout */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search recipes..."   className="border border-gray-300 focus-visible:border-[#F7D86C] focus-visible:ring-[#FF9800]/50 pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="outline" size="sm">
              Breakfast
            </Button>
            <Button variant="outline" size="sm">
              Lunch
            </Button>
            <Button variant="outline" size="sm">
              Dinner
            </Button>
            <Button variant="outline" size="sm">
              Snacks
            </Button>
          </div>
        </div>

        {/* Recipe Grid - Improved responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="w-full h-48 object-cover" />
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart
                    className={`h-4 w-4 ${recipe.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
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

                <Link href={`/recipes/${recipe.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Recipe
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
