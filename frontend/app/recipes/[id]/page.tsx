import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Heart, Edit, Share2 } from "lucide-react"
import Link from "next/link"

// This would typically come from a database based on the ID
const recipe = {
  id: 1,
  name: "Protein Smoothie Bowl",
  description:
    "A delicious and nutritious breakfast bowl packed with protein, fresh berries, and crunchy granola. Perfect for starting your day with sustained energy.",
  image: "/protein-smoothie-bowl-with-berries-and-granola.png",
  prepTime: "10 min",
  cookTime: "0 min",
  totalTime: "10 min",
  servings: 1,
  difficulty: "Easy",
  calories: 320,
  protein: 25,
  carbs: 15,
  fats: 12,
  category: "Breakfast",
  isFavorite: true,
  ingredients: [
    { name: "Greek yogurt", amount: "1", unit: "cup" },
    { name: "Protein powder (vanilla)", amount: "1", unit: "scoop" },
    { name: "Frozen mixed berries", amount: "1/2", unit: "cup" },
    { name: "Banana", amount: "1/2", unit: "medium" },
    { name: "Almond milk", amount: "1/4", unit: "cup" },
    { name: "Granola", amount: "2", unit: "tbsp" },
    { name: "Fresh blueberries", amount: "1/4", unit: "cup" },
    { name: "Chia seeds", amount: "1", unit: "tsp" },
  ],
  instructions: [
    "Add Greek yogurt, protein powder, frozen berries, banana, and almond milk to a blender.",
    "Blend until smooth and creamy, about 30-60 seconds.",
    "Pour the smoothie mixture into a bowl.",
    "Top with granola, fresh blueberries, and chia seeds.",
    "Serve immediately and enjoy your nutritious breakfast!",
  ],
  tags: ["High Protein", "Quick", "Breakfast", "Healthy"],
  author: "NutriTrack User",
  createdAt: "2024-01-15",
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/recipes">
            <Button variant="outline">← Back to Recipes</Button>
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{recipe.name}</h1>
                <p className="text-muted-foreground text-lg">{recipe.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Heart
                  className={`h-5 w-5 ${recipe.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Prep Time</div>
                  <div className="text-sm text-muted-foreground">{recipe.prepTime}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Servings</div>
                  <div className="text-sm text-muted-foreground">{recipe.servings}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Recipe
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Nutrition Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
            <CardDescription>Per serving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{recipe.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{recipe.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">{recipe.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-5">{recipe.fats}g</div>
                <div className="text-sm text-muted-foreground">Fats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients and Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <Badge variant="outline" className="min-w-fit">
                      {index + 1}
                    </Badge>
                    <span className="text-sm leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
