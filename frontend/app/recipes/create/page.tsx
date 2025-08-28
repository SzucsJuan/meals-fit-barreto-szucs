"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Plus, Minus, Save } from "lucide-react"
import Link from "next/link"

interface Ingredient {
  id: number
  name: string
  amount: string
  unit: string
}

interface Instruction {
  id: number
  step: string
}

export default function CreateRecipePage() {
  const [recipeName, setRecipeName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [servings, setServings] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, name: "", amount: "", unit: "" }])
  const [instructions, setInstructions] = useState<Instruction[]>([{ id: 1, step: "" }])
  const [nutrition, setNutrition] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  })

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map((i) => i.id)) + 1
    setIngredients([...ingredients, { id: newId, name: "", amount: "", unit: "" }])
  }

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((i) => i.id !== id))
    }
  }

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const addInstruction = () => {
    const newId = Math.max(...instructions.map((i) => i.id)) + 1
    setInstructions([...instructions, { id: newId, step: "" }])
  }

  const removeInstruction = (id: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((i) => i.id !== id))
    }
  }

  const updateInstruction = (id: number, step: string) => {
    setInstructions(instructions.map((i) => (i.id === id ? { ...i, step } : i)))
  }

  const handleSave = () => {
    // Here you would typically save to a database
    console.log("Saving recipe:", {
      recipeName,
      description,
      category,
      prepTime,
      servings,
      ingredients,
      instructions,
      nutrition,
    })
    // Redirect to recipes page or show success message
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Recipe</h1>
                <p className="text-muted-foreground">Share your healthy creations</p>
              </div>
            </div>
            <Link href="/recipes">
              <Button variant="outline">Back to Recipes</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipe-name">Recipe Name</Label>
                  <Input
                    id="recipe-name"
                    placeholder="Enter recipe name"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your recipe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prep-time">Prep Time</Label>
                  <Input
                    id="prep-time"
                    placeholder="e.g., 30 min"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="Number of servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>List all ingredients needed</CardDescription>
                </div>
                <Button onClick={addIngredient} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(ingredient.id, "amount", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => removeIngredient(ingredient.id)}
                    size="sm"
                    variant="ghost"
                    disabled={ingredients.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>Step-by-step cooking instructions</CardDescription>
                </div>
                <Button onClick={addInstruction} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={instruction.id} className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-2 min-w-fit">
                    Step {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Describe this step"
                      value={instruction.step}
                      onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => removeInstruction(instruction.id)}
                    size="sm"
                    variant="ghost"
                    disabled={instructions.length === 1}
                    className="mt-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Information</CardTitle>
              <CardDescription>Per serving nutritional values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={nutrition.calories}
                    onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    value={nutrition.protein}
                    onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    value={nutrition.carbs}
                    onChange={(e) => setNutrition({ ...nutrition, carbs: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="0"
                    value={nutrition.fats}
                    onChange={(e) => setNutrition({ ...nutrition, fats: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Recipe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
