"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Clock, Users, Plus, ChefHat } from "lucide-react";

import RequireAuth from "@/components/RequireAuth";
import Navigation from "@/components/navigation";
import FavoriteButton from "@/components/FavoriteButton";

import { useMyRecipes } from "@/lib/useMyRecipes";
import { useMyFavorites } from "@/lib/useMyFavorites";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Pagination({
  current,
  last,
  onPrev,
  onNext,
}: {
  current: number;
  last: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!last || last <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" onClick={onPrev} disabled={current <= 1}>
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {current} of {last}
      </span>
      <Button variant="outline" onClick={onNext} disabled={current >= last}>
        Next
      </Button>
    </div>
  );
}

type OnFavChange = (recipe: any, isFav: boolean) => void;

function RecipeGrid({
  items,
  emptyText,
  onFavChange,
}: {
  items: any[];
  emptyText: string;
  onFavChange?: (recipe: any, isFav: boolean) => void;
}) {
  if (!items?.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <CardTitle className="mb-2">No recipes</CardTitle>
          <CardDescription>{emptyText}</CardDescription>
          <div className="mt-4">
            <Link href="/discover">
              <Button>Go to Discover</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((r: any) => (
        <Card key={r.id} className="overflow-hidden hover:shadow">
          <div className="relative">
            <img
              src={r.image_url || "/placeholder.svg"}
              alt={r.title}
              className="w-full h-48 object-cover"
            />
            <FavoriteButton
              key={`${r.id}-${r.is_favorited ? "1" : "0"}`}
              recipeId={r.id}
              initialFavorited={Boolean(r.is_favorited)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onChange={(isFav) => onFavChange?.(r, isFav)}
            />
          </div>

          <CardHeader>
            <CardTitle className="text-lg">{r.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {r.description}
            </CardDescription>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {r.prep_time_minutes ?? 0} min
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {r.servings ?? 1} serving{(r.servings ?? 1) > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs mt-3">
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {Math.round(r.calories ?? 0)}
                </div>
                <div className="text-muted-foreground">cal</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {Math.round(r.protein ?? 0)}g
                </div>
                <div className="text-muted-foreground">protein</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {Math.round(r.carbs ?? 0)}g
                </div>
                <div className="text-muted-foreground">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-foreground">
                  {Math.round(r.fat ?? 0)}g
                </div>
                <div className="text-muted-foreground">fats</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex gap-2">
            <Link href={`/recipes/${r.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View
              </Button>
            </Link>
            <Link href={`/meals/add?fromRecipe=${r.id}`}>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Log
              </Button>
            </Link>
            <Link href={`/recipes/${r.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RecipesPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const tab = sp.get("tab") === "fav" ? "fav" : "mine";

  // paginación por tab
  const pageMine = Math.max(1, Number(sp.get("pageMine") || 1));
  const pageFav = Math.max(1, Number(sp.get("pageFav") || 1));

  const perPage = 12;

  const { data: myRecipes, meta: metaMine, loading: loadingMine, error: errMine } =
    useMyRecipes(perPage, pageMine);

  const { data: favs, meta: metaFav, loading: loadingFav, error: errFav } =
    useMyFavorites(perPage, pageFav);

  interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }

  const [favData, setFavData] = useState<any[]>([]);
  const [favMeta, setFavMeta] = useState<PaginationMeta | null>(null);

  const [myData, setMyData] = useState<any[]>([]);
  const [myMeta, setMyMeta] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    setMyData(myRecipes ?? []);
    setMyMeta(metaMine ?? null);
  }, [myRecipes, metaMine]);

  useEffect(() => {
    setFavData(favs ?? []);
    setFavMeta(metaFav ?? null);
  }, [favs, metaFav]);

  const setQuery = (patch: Record<string, string>) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    router.push(`/recipes?${next.toString()}`);
  };

  const onChangeTab = (value: string) => {
    setQuery({ tab: value, ...(value === "mine" ? { pageMine: "1" } : { pageFav: "1" }) });
  };

  function updateMyDataById(id: number, isFav: boolean) {
    setMyData((prev) => prev.map((r) => (r.id === id ? { ...r, is_favorited: isFav } : r)));
  }

  function addToFavIfNeeded(recipe: any) {
    setFavData((prev) => {
      if (prev.some((x) => x.id === recipe.id)) return prev;
      if ((favMeta?.current_page ?? 1) === 1) return [{ ...recipe, is_favorited: true }, ...prev];
      return prev;
    });
    setFavMeta((m) => (m ? { ...m, total: (m.total ?? 0) + 1 } : m));
  }

  function removeFromFavIfPresent(id: number) {
    setFavData((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (next.length === 0 && (favMeta?.current_page ?? 1) > 1) {
        setQuery({ tab: "fav", pageFav: String((favMeta!.current_page as number) - 1) });
      }
      return next;
    });
    setFavMeta((m) => (m ? { ...m, total: Math.max(0, (m.total ?? 0) - 1) } : m));
  }

  // callback central: sincroniza ambas listas
  function handleFavoriteChange(recipe: any, isFav: boolean) {
    updateMyDataById(recipe.id, isFav);

    // actualización de lista de favoritos
    if (isFav) addToFavIfNeeded(recipe);
    else removeFromFavIfPresent(recipe.id);
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Recipes</h1>
                <p className="text-muted-foreground">Manage your recipes</p>
              </div>
            </div>
            <Link href="/recipes/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Recipe
              </Button>
            </Link>
          </div>

          <Tabs value={tab} onValueChange={onChangeTab} className="w-full">
            <TabsList>
              <TabsTrigger value="mine">Created by me</TabsTrigger>
              <TabsTrigger value="fav">My Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="mine" className="mt-6">
              {loadingMine && <div className="text-sm text-muted-foreground">Loading...</div>}
              {errMine && <div className="text-sm text-red-600">Error: {errMine}</div>}

              {!loadingMine && !errMine && (
                <>
                  <RecipeGrid
                    items={myData}
                    emptyText="You haven't created any recipes yet."
                    onFavChange={handleFavoriteChange}
                  />

                  <Pagination
                    current={myMeta?.current_page ?? 1}
                    last={myMeta?.last_page ?? 1}
                    onPrev={() =>
                      setQuery({
                        tab: "mine",
                        pageMine: String(Math.max(1, (myMeta?.current_page ?? 1) - 1)),
                      })
                    }
                    onNext={() =>
                      setQuery({
                        tab: "mine",
                        pageMine: String(
                          Math.min(myMeta?.last_page ?? 1, (myMeta?.current_page ?? 1) + 1)
                        ),
                      })
                    }
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="fav" className="mt-6">
              {loadingFav && <div className="text-sm text-muted-foreground">Loading...</div>}
              {errFav && <div className="text-sm text-red-600">Error: {errFav}</div>}

              {!loadingFav && !errFav && (
                <>
                  <RecipeGrid
                    items={favData}
                    emptyText="Add recipes to your favorites to see them here."
                    onFavChange={handleFavoriteChange}
                  />

                  <Pagination
                    current={(favMeta?.current_page ?? 1)}
                    last={(favMeta?.last_page ?? 1)}
                    onPrev={() =>
                      setQuery({
                        tab: "fav",
                        pageFav: String(Math.max(1, (favMeta?.current_page ?? 1) - 1)),
                      })
                    }
                    onNext={() =>
                      setQuery({
                        tab: "fav",
                        pageFav: String(
                          Math.min(favMeta?.last_page ?? 1, (favMeta?.current_page ?? 1) + 1)
                        ),
                      })
                    }
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  );
}
