"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { useIngredients } from "@/lib/useIngredients";
import { useCreateMealLog, type MealType } from "@/lib/useCreateMealLog";
import { Search, Plus, Minus, Save, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectedFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;           
  serving_size: number;    
  serving_unit: "g" | "ml" | "unit"; 
  quantity: number;       
}

export default function AddMealPage() {
  const [mealType, setMealType] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ingredients, loading } = useIngredients(searchQuery);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const { createMealLog, loading: saving, error: saveError } = useCreateMealLog();
  const router = useRouter();

  const addFood = (ing: ReturnType<typeof useIngredients>["data"][number]) => {
    const food: SelectedFood = {
      id: ing.id,
      name: `${ing.name} (${ing.serving_size}${ing.serving_unit})`,
      calories: ing.calories,
      protein: ing.protein,
      carbs: ing.carbs,
      fats: ing.fat,
      serving_size: ing.serving_size,        
      serving_unit: ing.serving_unit,       
      quantity: 1,
    };
    const existing = selectedFoods.find((f) => f.id === food.id);
    if (existing) {
      setSelectedFoods(selectedFoods.map((f) => (f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f)));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) setSelectedFoods(selectedFoods.filter((f) => f.id !== id));
    else setSelectedFoods(selectedFoods.map((f) => (f.id === id ? { ...f, quantity } : f)));
  };

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories * f.quantity,
        protein: acc.protein + f.protein * f.quantity,
        carbs: acc.carbs + f.carbs * f.quantity,
        fats: acc.fats + f.fats * f.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [selectedFoods]);


  const handleSaveMeal = async () => {
    if (!mealType || selectedFoods.length === 0) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const log_date = `${yyyy}-${mm}-${dd}`;

    // logged_at (opcional): combinamos fecha + hora del selector
    const logged_at = mealTime
      ? `${log_date} ${mealTime}:00`
      : null;

    const details = selectedFoods.map((f) => {
          const grams =
            f.serving_unit === "g" || f.serving_unit === "ml"
              ? Math.round(f.quantity * f.serving_size)
              : null;

      return {
        ingredient_id: f.id,
        servings: f.quantity,
        grams,
        meal_type: mealType as MealType,
        logged_at,
      };
    });

    try {
      await createMealLog({ log_date, notes: null, details });
      setSelectedFoods([]);
      setMealTime("");
      setMealType("");
      setSearchQuery("");

      router.push("/meals");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8" style={{ color: "#FF9800" }} />
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
          <div className="space-y-6">
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
                  {/* <div className="space-y-2">
                    <Label htmlFor="meal-time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="meal-time"
                        type="time"
                        value={mealTime}
                        onChange={(e) => setMealTime(e.target.value)}
                        className="pl-10 border border-gray-300 focus-visible:border-[#F7D86C] focus-visible:ring-[#FF9800]/30"
                      />
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>

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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border border-gray-300 focus-visible:border-[#F7D86C] focus-visible:ring-[#FF9800]/30"
                  />
                </div>

                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {ingredients.map((ing) => (
                      <div key={ing.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                              {ing.name} ({ing.serving_size}{ing.serving_unit})
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {ing.is_verified ? "Verified" : "Community"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ing.calories} cal • {ing.protein}g protein • {ing.carbs}g carbs • {ing.fat}g fat
                          </div>
                        </div>
                        <Button onClick={() => addFood(ing)} size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {ingredients.length === 0 && (
                      <div className="text-sm text-muted-foreground">No results.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Foods and Summary */}
          <div className="space-y-6">
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

            <Button
              onClick={handleSaveMeal}
              className="w-full flex items-center gap-2"
              disabled={selectedFoods.length === 0 || !mealType || saving}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Meal"}
            </Button>

            {saveError && <div className="text-sm text-red-600">{saveError}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
