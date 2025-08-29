"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, TrendingUp, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import Navigation from "@/components/navigation"

// Sample meal data
const todaysMeals = [
  {
    id: 1,
    type: "Breakfast",
    time: "8:30 AM",
    foods: [
      { name: "Oatmeal with berries", calories: 280, protein: 8, carbs: 45, fats: 6 },
      { name: "Greek yogurt", calories: 100, protein: 17, carbs: 6, fats: 0 },
    ],
  },
  {
    id: 2,
    type: "Lunch",
    time: "12:45 PM",
    foods: [
      { name: "Grilled chicken breast", calories: 185, protein: 35, carbs: 0, fats: 4 },
      { name: "Quinoa salad", calories: 220, protein: 8, carbs: 39, fats: 5 },
    ],
  },
  {
    id: 3,
    type: "Snack",
    time: "3:30 PM",
    foods: [{ name: "Apple with almond butter", calories: 190, protein: 4, carbs: 25, fats: 8 }],
  },
]

const nutritionGoals = {
  calories: 2200,
  protein: 165,
  carbs: 275,
  fats: 73,
}

// Calculate totals
const totals = todaysMeals.reduce(
  (acc, meal) => {
    meal.foods.forEach((food) => {
      acc.calories += food.calories
      acc.protein += food.protein
      acc.carbs += food.carbs
      acc.fats += food.fats
    })
    return acc
  },
  { calories: 0, protein: 0, carbs: 0, fats: 0 },
)

const macroData = [
  { name: "Protein", value: totals.protein, color: "#ec4899" },
  { name: "Carbs", value: totals.carbs, color: "#be123c" },
  { name: "Fats", value: totals.fats, color: "#475569" },
]

const weeklyData = [
  { day: "Mon", calories: 2100, protein: 160, carbs: 250, fats: 70 },
  { day: "Tue", calories: 2050, protein: 155, carbs: 240, fats: 68 },
  { day: "Wed", calories: 2200, protein: 170, carbs: 280, fats: 75 },
  { day: "Thu", calories: 1950, protein: 145, carbs: 220, fats: 65 },
  { day: "Fri", calories: 2150, protein: 165, carbs: 260, fats: 72 },
  { day: "Sat", calories: 2300, protein: 175, carbs: 290, fats: 78 },
  { day: "Today", calories: totals.calories, protein: totals.protein, carbs: totals.carbs, fats: totals.fats },
]

export default function MealsPage() {
  const [selectedView, setSelectedView] = useState<"today" | "week">("today")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Meal Tracking</h1>
                <p className="text-muted-foreground">Monitor your daily nutrition intake</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={selectedView === "today" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("today")}
                >
                  Today
                </Button>
                <Button
                  variant={selectedView === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("week")}
                >
                  Week
                </Button>
              </div>
              <Link href="/meals/add">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Meal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedView === "today" ? (
          <>
            {/* Daily Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totals.calories}</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.calories} goal</div>
                  <Progress value={(totals.calories / nutritionGoals.calories) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totals.protein}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.protein}g goal</div>
                  <Progress value={(totals.protein / nutritionGoals.protein) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totals.carbs}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.carbs}g goal</div>
                  <Progress value={(totals.carbs / nutritionGoals.carbs) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totals.fats}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.fats}g goal</div>
                  <Progress value={(totals.fats / nutritionGoals.fats) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Macro Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Macro Distribution</CardTitle>
                  <CardDescription>Today's macronutrient breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}g`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {macroData.map((macro) => (
                      <div key={macro.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                        <span className="text-sm text-muted-foreground">{macro.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calorie Progress</CardTitle>
                  <CardDescription>Daily calorie intake vs goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Intake</span>
                      <span className="font-bold text-2xl text-primary">{totals.calories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Goal</span>
                      <span className="font-medium">{nutritionGoals.calories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-medium text-accent">{nutritionGoals.calories - totals.calories}</span>
                    </div>
                    <Progress value={(totals.calories / nutritionGoals.calories) * 100} className="h-3" />
                    <div className="text-center text-sm text-muted-foreground">
                      {Math.round((totals.calories / nutritionGoals.calories) * 100)}% of daily goal
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Meals */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
                <Link href="/meals/add">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </Link>
              </div>

              {todaysMeals.map((meal) => {
                const mealTotals = meal.foods.reduce(
                  (acc, food) => ({
                    calories: acc.calories + food.calories,
                    protein: acc.protein + food.protein,
                    carbs: acc.carbs + food.carbs,
                    fats: acc.fats + food.fats,
                  }),
                  { calories: 0, protein: 0, carbs: 0, fats: 0 },
                )

                return (
                  <Card key={meal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{meal.type}</Badge>
                          <span className="text-sm text-muted-foreground">{meal.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {meal.foods.map((food, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <div>
                              <div className="font-medium text-foreground">{food.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fats
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="font-medium text-foreground">Meal Total</span>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary">{mealTotals.calories} cal</span> •
                            {mealTotals.protein}g protein • {mealTotals.carbs}g carbs • {mealTotals.fats}g fats
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          /* Weekly View */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Nutrition Trends</CardTitle>
                <CardDescription>Your nutrition intake over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#ec4899" name="Calories" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Weekly Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Calories</span>
                      <span className="font-medium">2,107</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Protein</span>
                      <span className="font-medium">162g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Carbs</span>
                      <span className="font-medium">254g</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fats</span>
                      <span className="font-medium">71g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals Met</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Calorie Goal</span>
                      <span className="font-medium">5/7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Protein Goal</span>
                      <span className="font-medium">6/7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Carb Goal</span>
                      <span className="font-medium">4/7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fat Goal</span>
                      <span className="font-medium">5/7 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Days logging meals</div>
                    <div className="mt-4 text-xs text-muted-foreground">Keep it up! You're building a great habit.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
