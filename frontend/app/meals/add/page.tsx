"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, Save, Clock } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

// Sample food database
const foodDatabase = [
  { id: 1, name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6, category: "Protein" },
  { id: 2, name: "Brown Rice (1 cup cooked)", calories: 216, protein: 5, carbs: 45, fats: 1.8, category: "Carbs" },
  { id: 3, name: "Broccoli (1 cup)", calories: 25, protein: 3, carbs: 5, fats: 0.3, category: "Vegetables" },
  { id: 4, name: "Avocado (1 medium)", calories: 234, protein: 3, carbs: 12, fats: 21, category: "Fats" },
  { id: 5, name: "Greek Yogurt (1 cup)", calories: 100, protein: 17, carbs: 6, fats: 0, category: "Protein" },
  { id: 6, name: "Oatmeal (1 cup cooked)", calories: 154, protein: 6, carbs: 28, fats: 3, category: "Carbs" },
  { id: 7, name: "Salmon (100g)", calories: 208, protein: 25, carbs: 0, fats: 12, category: "Protein" },
  { id: 8, name: "Sweet Potato (1 medium)", calories: 112, protein: 2, carbs: 26, fats: 0.1, category: "Carbs" },
  { id: 9, name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fats: 14, category: "Fats" },
  { id: 10, name: "Spinach (1 cup)", calories: 7, protein: 1, carbs: 1, fats: 0.1, category: "Vegetables" },
]

interface SelectedFood {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  quantity: number
}

export default function AddMealPage() {
  const [mealType, setMealType] = useState("")
  const [mealTime, setMealTime] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([])
  const [filteredFoods, setFilteredFoods] = useState(foodDatabase)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = foodDatabase.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredFoods(filtered)
  }

  const addFood = (food: (typeof foodDatabase)[0]) => {
    const existingFood = selectedFoods.find((f) => f.id === food.id)
    if (existingFood) {
      setSelectedFoods(selectedFoods.map((f) => (f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f)))
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedFoods(selectedFoods.filter((f) => f.id !== id))
    } else {
      setSelectedFoods(selectedFoods.map((f) => (f.id === id ? { ...f, quantity } : f)))
    }
  }

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
        fats: acc.fats + food.fats * food.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )
  }

  const totals = calculateTotals()

  const handleSaveMeal = () => {
    // Here you would typically save to a database
    console.log("Saving meal:", {
      mealType,
      mealTime,
      foods: selectedFoods,
      totals,
    })
    // Redirect back to meals page
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Add Meal</h1>
                <p className="text-muted-foreground">Log your nutrition intake</p>
              </div>
            </div>
            <Link href="/meals">
              <Button variant="outline">Back to Meals</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Food Search and Selection */}
          <div className="space-y-6">
            {/* Meal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="meal-time"
                        type="time"
                        value={mealTime}
                        onChange={(e) => setMealTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Food Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Foods</CardTitle>
                <CardDescription>Find and add foods to your meal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for foods..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{food.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {food.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fats
                        </div>
                      </div>
                      <Button onClick={() => addFood(food)} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Foods and Summary */}
          <div className="space-y-6">
            {/* Selected Foods */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Foods</CardTitle>
                <CardDescription>
                  {selectedFoods.length} item{selectedFoods.length !== 1 ? "s" : ""} selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedFoods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No foods selected yet. Search and add foods from the left panel.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedFoods.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{food.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(food.calories * food.quantity)} cal •{Math.round(food.protein * food.quantity)}g
                            protein •{Math.round(food.carbs * food.quantity)}g carbs •
                            {Math.round(food.fats * food.quantity)}g fats
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(food.id, food.quantity - 1)}
                            size="sm"
                            variant="outline"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{food.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(food.id, food.quantity + 1)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nutrition Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Summary</CardTitle>
                <CardDescription>Total nutritional values for this meal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{Math.round(totals.calories)}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{Math.round(totals.protein)}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-chart-3/5 rounded-lg">
                    <div className="text-2xl font-bold text-chart-3">{Math.round(totals.carbs)}g</div>
                    <div className="text-sm text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center p-4 bg-chart-5/5 rounded-lg">
                    <div className="text-2xl font-bold text-chart-5">{Math.round(totals.fats)}g</div>
                    <div className="text-sm text-muted-foreground">Fats</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSaveMeal}
              className="w-full flex items-center gap-2"
              disabled={selectedFoods.length === 0 || !mealType}
            >
              <Save className="h-4 w-4" />
              Save Meal
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
