"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Users, Plus, Binoculars } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import RequireAuth from "@/components/RequireAuth";
import FavoriteButton from "@/components/FavoriteButton";
import { fetchDiscover, type DiscoverRecipe } from "@/lib/discover";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

type SortKey = "recent" | "name" | "calories";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<DiscoverRecipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedQuery = useDebouncedValue(searchQuery, 450);

  const order = useMemo(() => {
    switch (sortBy) {
      case "name":
        return "name";
      case "calories":
        return "calories";
      case "recent":
      default:
        return "latest";
    }
  }, [sortBy]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const normalizedQuery = debouncedQuery.trim();
      const effectiveQuery =
        normalizedQuery.length >= 2 ? normalizedQuery : undefined;

      const json = await fetchDiscover({
        q: effectiveQuery,
        order,
        page,
        per_page: 12,
      });

      setRecipes(json.data ?? []);
      setTotalPages(json.meta?.last_page ?? 1);
      setTotalResults(json.meta?.total ?? (json.data?.length ?? 0));
    } catch (e: any) {
      setError(e.message || "Error loading recipes");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, order, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, order]);

  useEffect(() => {
    load();
  }, [load]);

  const hasActiveSearch = debouncedQuery.trim().length >= 2;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Binoculars className="h-8 w-8" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Discover. Get inspired. Cook.
                  </h1>
                  <p className="text-muted-foreground">
                    Explore community creations
                  </p>
                </div>
              </div>
              <Link href="/recipes">
                <Button variant="outline">Back to Recipes</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find your next recipe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="calories">Calories (High → Low)</option>
            </select>
          </div>

          {/* Info de resultados */}
          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <div>
              {loading
                ? "Loading recipes..."
                : `Showing ${recipes.length} of ${totalResults} recipes`}
              {hasActiveSearch && !loading && (
                <span>
                  {" "}
                  for <span className="font-medium">"{debouncedQuery}"</span>
                </span>
              )}
            </div>
            {error && (
              <div className="text-red-600 text-xs">
                {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse h-72" />
              ))}
            </div>
          ) : recipes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((r) => (
                  <Card
                    key={r.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={
                          (r as any).image_thumb_url ??
                          (r as any).image_url ??
                          "/placeholder.svg"
                        }
                        alt={r.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          recipeId={r.id}
                          initialFavorited={!!(r as any).is_favorited}
                          onChange={() => {}}
                        />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">
                        {r.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {r.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {r.prep_time_minutes} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {r.servings}{" "}
                          {r.servings === 1 ? "serving" : "servings"}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-foreground">
                            {Math.round(r.calories)}
                          </div>
                          <div className="text-muted-foreground">cal</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">
                            {Math.round(r.protein)}g
                          </div>
                          <div className="text-muted-foreground">protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">
                            {Math.round(r.carbs)}g
                          </div>
                          <div className="text-muted-foreground">carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">
                            {Math.round(r.fat)}g
                          </div>
                          <div className="text-muted-foreground">fats</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/discover/${r.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            size="sm"
                          >
                            View Recipe
                          </Button>
                        </Link>
                        <Link href={`/meals/add?recipeId=${r.id}`}>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Log
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Binoculars className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No recipes found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveSearch
                    ? "Try adjusting your search"
                    : "Be the first to share a public recipe!"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
