"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus, Search, Clock, Users, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRecipes } from "@/lib/useRecipes";
import RequireAuth from "@/components/RequireAuth";
import Navigation from "@/components/navigation"
import { getRecipeImageUrl } from "@/lib/image";

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const { data: recipes, loading, error } = useRecipes(search);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Header */}
        <div className="border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ChefHat className="h-8 w-8" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Collection</h1>
                  <p className="text-muted-foreground">Find your favorite recipes</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
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
          {/* Search */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 focus-visible:border-[#F7D86C] focus-visible:ring-[#FF9800]/50 pl-10"
              />
            </div>
          </div>

          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {recipes.map((r) => {
              const totalMinutes = (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0);
              return (
                <Card key={r.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={getRecipeImageUrl(r) || "/placeholder.svg"}
                      alt={r.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge variant="secondary" className="absolute bottom-2 left-2 bg-white/90">
                      Public
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{r.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{r.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {totalMinutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {r.servings} serving{r.servings > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{Math.round(r.calories)}</div>
                        <div className="text-muted-foreground">cal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{Math.round(r.protein)}g</div>
                        <div className="text-muted-foreground">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{Math.round(r.carbs)}g</div>
                        <div className="text-muted-foreground">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{Math.round(r.fat)}g</div>
                        <div className="text-muted-foreground">fats</div>
                      </div>
                    </div>

                    <Link href={`/recipes/${r.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Recipe
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
