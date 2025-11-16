"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navigation from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMe } from "@/lib/useMe";
import { detailRecipe } from "@/lib/detailRecipe";
import { useDeleteRecipe } from "@/lib/useDeleteRecipe";
import DeleteModalRecipe from "@/components/DeleteModalRecipe";
import FavoriteButton from "@/components/FavoriteButton";
import { ensureCsrf, xsrfHeader } from "@/lib/csrf";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function splitSteps(steps?: string | null) {
  if (!steps) return [];
  return steps
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: r, loading, error } = id
    ? detailRecipe(id)
    : { data: null, loading: true, error: null as any };
  const { user: me } = useMe();
  const { deleteRecipe } = useDeleteRecipe();

  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = !!(me && r?.user?.id && me.id === r.user.id);
  const canDelete = isOwner;
  const isAdmin = me?.role === "admin";

  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [updatingVis, setUpdatingVis] = useState(false);

  useEffect(() => {
    if (r?.visibility === "public" || r?.visibility === "private") {
      setVisibility(r.visibility);
    }
  }, [r?.visibility]);

  async function toggleVisibility(nextVis: "public" | "private") {
    if (!r || updatingVis || visibility === nextVis) return;
    try {
      setUpdatingVis(true);

      await ensureCsrf(BASE);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      Object.assign(headers, xsrfHeader());
      const res = await fetch(`${BASE}/api/recipes/${r.id}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({ visibility: nextVis }),
      });

      if (!res.ok) throw new Error(`Failed to update visibility (${res.status})`);
      setVisibility(nextVis);
    } catch (e) {
      console.error(e);
      alert("No se pudo cambiar la visibilidad.");
    } finally {
      setUpdatingVis(false);
    }
  }

  async function handleDelete() {
    if (!r) return;
    try {
      const ok = await deleteRecipe(r.id);
      if (ok) router.push("/recipes");
    } catch (e) {
      console.error(e);
      alert("Error deleting recipe.");
    }
  }

  const totalMinutes =
    (r?.prep_time_minutes ?? 0) + (r?.cook_time_minutes ?? 0);
  const steps = splitSteps(r?.steps);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔙 Botones de back */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/recipes">
            <Button variant="outline">Back to Recipes</Button>
          </Link>

          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline">Back to Admin Panel</Button>
            </Link>
          )}
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!loading && !r && !error && (
          <div className="text-sm text-muted-foreground">Recipe not found.</div>
        )}

        {r && (
          <>
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-4">
              <div>
                <img
                  src={r.image_url || "/placeholder.svg"}
                  alt={r.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {r.title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {r.description}
                    </p>
                    {r.user?.name && (
                      <p className="text-xs text-muted-foreground mt-2">
                        by {r.user.name}
                      </p>
                    )}
                  </div>

                  <FavoriteButton
                    recipeId={r.id}
                    initialFavorited={!!r.is_favorited}
                    onChange={() => {}}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{visibility}</Badge>
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
                      <div className="text-sm text-muted-foreground">
                        {totalMinutes} min
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Servings</div>
                      <div className="text-sm text-muted-foreground">
                        {r.servings}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="flex-1 min-w-[160px]">
                    <Link href={`/recipes/${r.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Recipe
                    </Link>
                  </Button>

                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant={
                          visibility === "public" ? "default" : "outline"
                        }
                        size="sm"
                        disabled={updatingVis}
                        onClick={() => toggleVisibility("public")}
                      >
                        Public
                      </Button>
                      <Button
                        variant={
                          visibility === "private" ? "default" : "outline"
                        }
                        size="sm"
                        disabled={updatingVis}
                        onClick={() => toggleVisibility("private")}
                      >
                        Private
                      </Button>
                    </div>
                  )}

                  {canDelete && (
                    <>
                      <Button
                        onClick={() => setShowConfirm(true)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>

                      <DeleteModalRecipe
                        open={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={() => {
                          setShowConfirm(false)
                          handleDelete()
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <Card className="mb-8">
              <CardHeader className="pt-4">
                <CardTitle>Nutrition Information</CardTitle>
                <CardDescription>
                  Total (recipe) – si querés por porción dividí por {r.servings}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(r.calories)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Calories
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {Math.round(r.protein)}g
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Protein
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-3">
                      {Math.round(r.carbs)}g
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Carbs
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-5">
                      {Math.round(r.fat)}g
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fats
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients & Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="pt-4">
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {r.ingredients.map((ing: any) => (
                      <li key={ing.id}>
                        {ing.pivot.quantity} {ing.pivot.unit} – {ing.name}{" "}
                        {ing.pivot.notes && `(${ing.pivot.notes})`}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pt-4">
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  {steps.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No steps provided.
                    </div>
                  ) : (
                    <ol className="space-y-4">
                      {steps.map((st, idx) => (
                        <li key={idx} className="flex gap-4">
                          <Badge variant="outline" className="min-w-fit">
                            {idx + 1}
                          </Badge>
                          <span className="text-sm leading-relaxed">
                            {st}
                          </span>
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
  );
}
