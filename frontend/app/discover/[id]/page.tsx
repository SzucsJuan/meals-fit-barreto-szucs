"use client";

import RequireAuth from "@/components/RequireAuth";
import Navigation from "@/components/navigation";
import FavoriteButton from "@/components/FavoriteButton";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

import { detailRecipe } from "@/lib/detailRecipe";
// Si tu type RecipeDetail no tiene is_favorited, lo tratamos como opcional

function splitSteps(steps?: string | null) {
  if (!steps) return [];
  return steps.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

export default function DiscoverRecipeDetailPage({ params }: { params: { id: string } }) {
  const { data: r, loading, error } = detailRecipe(params.id);

  const totalMinutes = (r?.prep_time_minutes ?? 0) + (r?.cook_time_minutes ?? 0);
  const steps = splitSteps(r?.steps);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/discover">
              <Button variant="outline">Back to Discover</Button>
            </Link>
          </div>

          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}
          {!loading && !r && !error && (
            <div className="text-sm text-muted-foreground">Recipe not found.</div>
          )}

          {r && (
            <>
              {/* Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-4">
                <div className="relative">
                  <img
                    src={r.image_url || "/placeholder.svg"}
                    alt={r.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {/* ❤️ favoritos en el detalle */}
                  <FavoriteButton
                    key={`${r.id}-${(r as any).is_favorited ? "1" : "0"}`}
                    recipeId={r.id}
                    initialFavorited={Boolean((r as any).is_favorited)}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{r.title}</h1>
                      {r.description && (
                        <p className="text-muted-foreground text-lg">{r.description}</p>
                      )}
                      {r.user?.name && (
                        <p className="text-xs text-muted-foreground mt-2">by {r.user.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{r.visibility}</Badge>
                    {typeof r.avg_rating === "number" && (
                      <Badge variant="outline">
                        ★ {r.avg_rating.toFixed(1)} ({r.votes_count ?? 0})
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Total Time</div>
                        <div className="text-sm text-muted-foreground">{totalMinutes} min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Servings</div>
                        <div className="text-sm text-muted-foreground">{r.servings}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Nutrition Information</CardTitle>
                  <CardDescription>
                    Total (recipe) – por porción dividí por {r.servings}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.round(r.calories)}</div>
                      <div className="text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{Math.round(r.protein)}g</div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-3">{Math.round(r.carbs)}g</div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-5">{Math.round(r.fat)}g</div>
                      <div className="text-sm text-muted-foreground">Fats</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients & Instructions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {r.ingredients.map((ing) => (
                        <li key={ing.id}>
                          {ing.pivot.quantity} {ing.pivot.unit} – {ing.name}{" "}
                          {ing.pivot.notes && `(${ing.pivot.notes})`}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {steps.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No steps provided.</div>
                    ) : (
                      <ol className="space-y-4">
                        {steps.map((st, idx) => (
                          <li key={idx} className="flex gap-4">
                            <Badge variant="outline" className="min-w-fit">
                              {idx + 1}
                            </Badge>
                            <span className="text-sm leading-relaxed">{st}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
