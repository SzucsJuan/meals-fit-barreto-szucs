"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, Edit, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useTodayMealLog } from "@/lib/useTodayMealLog";

const nutritionGoals = { calories: 2200, protein: 165, carbs: 275, fats: 73 };

export default function MealsPage() {
  const [selectedView, setSelectedView] = useState<"today" | "week">("today");
  const { dayTotals, mealCards, loading, error, refetch } = useTodayMealLog(1);

  const macroData = useMemo(() => ([
    { name: "Protein", value: dayTotals.protein, color: "#F74800" },
    { name: "Carbs",   value: dayTotals.carbs,   color: "#629178" },
    { name: "Fats",    value: dayTotals.fats,    color: "#475569" },
  ]), [dayTotals]);

  // placeholder semanal (cuando tengas endpoint weekly lo reemplazás)
  const weeklyData = useMemo(() => {
    return [
      { day: "Mon", calories: 2100 },
      { day: "Tue", calories: 2050 },
      { day: "Wed", calories: 2200 },
      { day: "Thu", calories: 1950 },
      { day: "Fri", calories: 2150 },
      { day: "Sat", calories: 2300 },
      { day: "Today", calories: dayTotals.calories },
    ];
  }, [dayTotals]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Meal Tracking</h1>
                <p className="text-muted-foreground">Monitor your daily nutrition intake</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex p-2">
                <Button variant={selectedView === "today" ? "default" : "ghost"} size="sm" onClick={() => setSelectedView("today")} className="mr-1">Today</Button>
                <Button variant={selectedView === "week" ? "default" : "ghost"}  size="sm" onClick={() => setSelectedView("week")}>Week</Button>
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
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}

        {selectedView === "today" ? (
          <>
            {/* Daily Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{dayTotals.calories}</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.calories} goal</div>
                  <Progress value={(dayTotals.calories / nutritionGoals.calories) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{dayTotals.protein}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.protein}g goal</div>
                  <Progress value={(dayTotals.protein / nutritionGoals.protein) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{dayTotals.carbs}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.carbs}g goal</div>
                  <Progress value={(dayTotals.carbs / nutritionGoals.carbs) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Fats</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{dayTotals.fats}g</div>
                  <div className="text-xs text-muted-foreground">of {nutritionGoals.fats}g goal</div>
                  <Progress value={(dayTotals.fats / nutritionGoals.fats) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Macro Distribution / Calorie Progress */}
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
                        <Pie data={macroData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {macroData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}g`} />
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
                      <span className="font-bold text-2xl text-primary">{dayTotals.calories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Goal</span>
                      <span className="font-medium">{nutritionGoals.calories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-medium">{nutritionGoals.calories - dayTotals.calories}</span>
                    </div>
                    <Progress value={(dayTotals.calories / nutritionGoals.calories) * 100} className="h-3" />
                    <div className="text-center text-sm text-muted-foreground">
                      {Math.round((dayTotals.calories / nutritionGoals.calories) * 100)}% of daily goal
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Meals (desde backend) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
                  <Link href="/meals/add">
                    <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Meal</Button>
                  </Link>
                </div>
              </div>

              {mealCards.length === 0 && !loading && (
                <Card><CardContent className="py-6 text-sm text-muted-foreground">No meals logged today.</CardContent></Card>
              )}

              {mealCards.map((meal, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{meal.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {meal.details.map((d) => {
                        const label =
                          d.ingredient?.name ??
                          d.recipe?.title ??
                          `Item #${d.id}`;
                        return (
                          <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div>
                              <div className="font-medium text-foreground">{label}</div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round(d.calories)} cal • {Math.round(d.protein)}g protein • {Math.round(d.carbs)}g carbs • {Math.round(d.fat)}g fats
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="font-medium text-foreground">Meal Total</span>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary">{Math.round(meal.totals.calories)} cal</span> •
                          {Math.round(meal.totals.protein)}g protein • {Math.round(meal.totals.carbs)}g carbs • {Math.round(meal.totals.fats)}g fats
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Weekly View (placeholder)
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
                      <Bar dataKey="calories" fill="#FC9A0E" name="Calories" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* … tarjetas estáticas, las podés conectar más adelante */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Weekly Average</CardTitle></CardHeader><CardContent>Conectaremos luego</CardContent></Card>
              <Card><CardHeader><CardTitle>Goals Met</CardTitle></CardHeader><CardContent>Conectaremos luego</CardContent></Card>
              <Card><CardHeader><CardTitle>Streak</CardTitle></CardHeader><CardContent>Conectaremos luego</CardContent></Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
