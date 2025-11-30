"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChefHat,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

import { useIngredients as useIngredientsHook } from "@/lib/useIngredients";
import { useCreateRecipe, type FormRow, type Unit } from "@/lib/useCreateRecipe";
import { apiRecipeImages } from "@/lib/api";
import { buildUrl } from "@/lib/api";

type RecipeRow = {
  id: number;
  name: string;
  description: string | null;
  author: string | null;
  author_email: string | null;
  visibility: "public" | "private" | string;
  category: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: string | null;
};

type VisibilityFilter = "all" | "public" | "private";

// Helpers de sanctum
function getXsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureCsrf() {
  await fetch(buildUrl("sanctum/csrf-cookie"), {
    method: "GET",
    credentials: "include",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
}

export default function AdminRecipesPage() {
  // ---------- LISTADO DE RECETAS ----------
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterVisibility, setFilterVisibility] = useState<VisibilityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- EDIT RECETAS----------
  const [editingRecipe, setEditingRecipe] = useState<RecipeRow | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ---------- ADD RECETAS ----------
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: ingredientOptions } = useIngredientsHook("");
  const { createRecipe, loading: creating, error: createError } = useCreateRecipe();

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVisibility, setNewVisibility] = useState<"public" | "private">("public");
  const [newPrepTime, setNewPrepTime] = useState("");
  const [newCookTime, setNewCookTime] = useState("");
  const [newServings, setNewServings] = useState("");

  const [newRows, setNewRows] = useState<FormRow[]>([
    { tempId: 1, ingredient_id: null, quantity: "", unit: "" },
  ]);

  const [newSteps, setNewSteps] = useState<{ id: number; step: string }[]>([
    { id: 1, step: "" },
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const ingredientUnitMap = useMemo(() => {
    const m = new Map<number, Unit>();
    ingredientOptions.forEach((i: any) =>
      m.set(i.id, i.serving_unit as Unit)
    );
    return m;
  }, [ingredientOptions]);

  const clearAddForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewVisibility("public");
    setNewPrepTime("");
    setNewCookTime("");
    setNewServings("");
    setNewRows([{ tempId: 1, ingredient_id: null, quantity: "", unit: "" }]);
    setNewSteps([{ id: 1, step: "" }]);

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setDragOver(false);
  };

  // ---------- fetch recipes ----------
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterVisibility !== "all") params.set("visibility", filterVisibility);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(buildUrl(`/api/admin/recipes?${params.toString()}`), {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!res.ok) {
        throw new Error(`Error al cargar recetas (${res.status})`);
      }

      const data: RecipeRow[] = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes", err);
      setError("No se pudieron cargar las recetas");
    } finally {
      setLoading(false);
    }
  }, [filterVisibility, searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // ---------- EDIT ----------
  const getVisibilityBadge = (visibility: "public" | "private" | string) => {
    if (visibility === "public") {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        >
          Public
        </Badge>
      );
    }
    if (visibility === "private") {
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
        >
          Private
        </Badge>
      );
    }
    return null;
  };

  const handleEdit = (recipe: RecipeRow) => {
    setEditingRecipe(recipe);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRecipe) return;

    try {
      await ensureCsrf();
      const token = getXsrfToken();

      const res = await fetch(buildUrl(`/api/admin/recipes/${editingRecipe.id}`), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          name: editingRecipe.name,
          description: editingRecipe.description,
          visibility: editingRecipe.visibility,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error al actualizar receta (${res.status})`);
      }

      const updated: RecipeRow = await res.json();

      setRecipes((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
      );
      setIsEditDialogOpen(false);
      setEditingRecipe(null);
    } catch (err) {
      console.error("Error updating recipe", err);
      alert("No se pudo actualizar la receta");
    }
  };

  const handleDelete = async (recipeId: number) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await ensureCsrf();
      const token = getXsrfToken();

      const res = await fetch(buildUrl(`/api/admin/recipes/${recipeId}`), {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": token,
        },
      });

      if (!res.ok && res.status !== 204) {
        throw new Error(`Error al eliminar receta (${res.status})`);
      }

      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      console.error("Error deleting recipe", err);
      alert("No se pudo eliminar la receta");
    }
  };

  const filteredRecipes = recipes;

  const totalRecipes = recipes.length;
  const totalPublic = recipes.filter((r) => r.visibility === "public").length;
  const totalPrivate = recipes.filter((r) => r.visibility === "private").length;

  // ---------- ADD ----------
  const addRow = () => {
    const nextId =
      newRows.length > 0 ? Math.max(...newRows.map((r) => r.tempId)) + 1 : 1;
    setNewRows([
      ...newRows,
      { tempId: nextId, ingredient_id: null, quantity: "", unit: "" },
    ]);
  };

  const removeRow = (tempId: number) => {
    if (newRows.length === 1) return;
    setNewRows(newRows.filter((r) => r.tempId !== tempId));
  };

  const updateRow = (tempId: number, patch: Partial<FormRow>) => {
    setNewRows(newRows.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)));
  };

  const addStep = () => {
    const nextId =
      newSteps.length > 0 ? Math.max(...newSteps.map((s) => s.id)) + 1 : 1;
    setNewSteps([...newSteps, { id: nextId, step: "" }]);
  };

  const removeStep = (id: number) => {
    if (newSteps.length === 1) return;
    setNewSteps(newSteps.filter((s) => s.id !== id));
  };

  const updateStep = (id: number, step: string) => {
    setNewSteps(newSteps.map((s) => (s.id === id ? { ...s, step } : s)));
  };

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type))
      return alert("Formato no soportado (usa JPG/PNG/WebP).");
    if (f.size > 5 * 1024 * 1024) return alert("Máximo 5MB.");
    setImageFile(f);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
  }

  // ---------- ADD: handler principal ----------
  const handleCreateRecipeAdmin = async () => {
    const normalizedRows = newRows.map((r) => ({
      ...r,
      unit: (r.unit ||
        (r.ingredient_id
          ? (ingredientUnitMap.get(r.ingredient_id) ?? "")
          : "")) as Unit | "",
    }));

    try {
      const created = await createRecipe({
        title: newTitle,
        description: newDescription,
        stepsList: newSteps.map((s) => s.step),
        visibility: newVisibility,
        servings: newServings,
        prepTime: newPrepTime,
        cookTime: newCookTime,
        rows: normalizedRows,
      });

      if (created?.id && imageFile) {
        try {
          await apiRecipeImages.upload(created.id, imageFile);
        } catch (e: any) {
          console.error(e);
        } finally {
          clearImage();
        }
      }

      // Se refresca el listado del admin
      await fetchRecipes();
      clearAddForm();
      setIsAddDialogOpen(false);
    } catch (e) {
      console.error("Error creando receta desde admin", e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="p-2">
                <ChefHat className="h-8 w-8" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Recipe Management
                </h1>
                <p className="text-muted-foreground">
                  Moderate and manage all recipes
                </p>
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Recipe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Recipe</DialogTitle>
                  <DialogDescription>
                    Crea una nueva receta con los mismos campos que el usuario.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <Card>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Recipe Name</Label>
                          <Input
                            id="title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visibility">Visibility</Label>
                          <Select
                            value={newVisibility}
                            onValueChange={(v: any) =>
                              setNewVisibility(v as "public" | "private")
                            }
                          >
                            <SelectTrigger id="visibility">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea
                          id="desc"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Prep Time (min)</Label>
                          <Input
                            type="number"
                            value={newPrepTime}
                            onChange={(e) => setNewPrepTime(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cook Time (min)</Label>
                          <Input
                            type="number"
                            value={newCookTime}
                            onChange={(e) => setNewCookTime(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Servings</Label>
                          <Input
                            type="number"
                            value={newServings}
                            onChange={(e) => setNewServings(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Ingredients</CardTitle>
                          <CardDescription>
                            Select ingredients and amounts
                          </CardDescription>
                        </div>
                        <Button onClick={addRow} size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {newRows.map((row) => {
                        const selected = ingredientOptions.find(
                          (i: any) => i.id === row.ingredient_id || 0
                        );
                        const defaultUnit = selected?.serving_unit ?? "";
                        return (
                          <div
                            key={row.tempId}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                          >
                            <div className="md:col-span-6">
                              <Label>Ingredient</Label>
                              <Select
                                value={
                                  row.ingredient_id
                                    ? String(row.ingredient_id)
                                    : ""
                                }
                                onValueChange={(val) => {
                                  const id = Number(val);
                                  const autoUnit =
                                    ingredientUnitMap.get(id) ?? "";
                                  updateRow(row.tempId, {
                                    ingredient_id: id,
                                    unit: (row.unit ||
                                      autoUnit) as Unit | "",
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ingredient" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ingredientOptions.map((opt: any) => (
                                    <SelectItem
                                      key={opt.id}
                                      value={String(opt.id)}
                                    >
                                      {opt.name}{" "}
                                      <span className="text-xs text-muted-foreground">
                                        ({opt.serving_unit})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="md:col-span-3">
                              <Label>Quantity</Label>
                              <Input
                                placeholder="0"
                                value={row.quantity}
                                onChange={(e) =>
                                  updateRow(row.tempId, {
                                    quantity: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label>Unit</Label>
                              <Select
                                value={row.unit || ""}
                                onValueChange={(v: any) =>
                                  updateRow(row.tempId, { unit: v })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={defaultUnit || "unit"}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="unit">unit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="md:col-span-1 flex items-end">
                              <Button
                                onClick={() => removeRow(row.tempId)}
                                size="sm"
                                variant="ghost"
                                disabled={newRows.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="md:col-span-12">
                              <Input
                                placeholder="Notes (optional)"
                                value={row.notes ?? ""}
                                onChange={(e) =>
                                  updateRow(row.tempId, {
                                    notes: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Instructions</CardTitle>
                          <CardDescription>Step-by-step</CardDescription>
                        </div>
                        <Button onClick={addStep} size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Add Step
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {newSteps.map((st, idx) => (
                        <div key={st.id} className="flex items-start gap-3">
                          <Badge
                            variant="outline"
                            className="mt-2 min-w-fit"
                          >
                            Step {idx + 1}
                          </Badge>
                          <Textarea
                            value={st.step}
                            onChange={(e) =>
                              updateStep(st.id, e.target.value)
                            }
                            placeholder="Describe this step"
                          />
                          <Button
                            onClick={() => removeStep(st.id)}
                            size="sm"
                            variant="ghost"
                            disabled={newSteps.length === 1}
                            className="mt-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pt-4">
                      <CardTitle>Recipe Image</CardTitle>
                      <CardDescription>
                        Subí una imagen (JPG/PNG/WebP · máx 5MB)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={[
                          "rounded-2xl border border-dashed p-4 md:p-5",
                          dragOver
                            ? "border-orange-400 ring-2 ring-orange-300/50"
                            : "border-muted",
                        ].join(" ")}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          const f = e.dataTransfer.files?.[0];
                          if (!f) return;
                          if (!/^image\/(jpeg|png|webp)$/.test(f.type))
                            return alert("Formato no soportado.");
                          if (f.size > 5 * 1024 * 1024)
                            return alert("Máximo 5MB.");
                          setImageFile(f);
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          const url = URL.createObjectURL(f);
                          setImagePreview(url);
                        }}
                      >
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="relative w-full md:w-64 rounded-xl overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
                            <div className="aspect-square relative">
                              {imagePreview ? (
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  fill
                                  sizes="256px"
                                  style={{ objectFit: "cover" }}
                                  priority
                                />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    document
                                      .getElementById("admin-add-image-input")
                                      ?.click()
                                  }
                                  className="absolute inset-0 grid place-items-center text-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                >
                                  <div className="flex flex-col items-center gap-2 px-6">
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      className="opacity-70"
                                    >
                                      <path
                                        d="M12 5v14m7-7H5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <span>
                                      Arrastrá una imagen acá, o{" "}
                                      <span className="text-orange-600 underline">
                                        explorá
                                      </span>
                                    </span>
                                    <span className="text-xs opacity-70">
                                      JPG, PNG o WebP · Máx 5MB
                                    </span>
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                id="admin-add-image-input"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={pickFile}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  document
                                    .getElementById("admin-add-image-input")
                                    ?.click()
                                }
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                                  bg-orange-600 text-white hover:bg-orange-700"
                              >
                                {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                              </button>

                              {imagePreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("¿Quitar la imagen seleccionada?"))
                                      clearImage();
                                  }}
                                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                                  border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  Quitar
                                </button>
                              )}
                            </div>

                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {imagePreview
                                ? "La imagen se subirá automáticamente al guardar la receta."
                                : "Opcional: podés seleccionar una imagen ahora y se subirá al guardar."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearAddForm();
                      setIsAddDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRecipeAdmin} disabled={creating}>
                    {creating ? "Saving..." : "Create Recipe"}
                  </Button>
                </DialogFooter>

                {createError && (
                  <p className="mt-2 text-sm text-red-600">{createError}</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalRecipes}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Public
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalPublic}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalPrivate}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or authors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterVisibility === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterVisibility("all")}
            >
              All
            </Button>
            <Button
              variant={filterVisibility === "public" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterVisibility("public")}
            >
              Public
            </Button>
            <Button
              variant={filterVisibility === "private" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterVisibility("private")}
            >
              Private
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pt-4">
            <CardTitle>Recipes ({filteredRecipes.length})</CardTitle>
            <CardDescription>
              Manage all recipes on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 text-sm text-red-500">{error}</p>
            )}
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading recipes...
              </p>
            ) : (
              <div className="space-y-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {recipe.name}
                          </h3>
                          {getVisibilityBadge(recipe.visibility)}
                          {recipe.category && (
                            <Badge variant="outline">{recipe.category}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {recipe.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          {recipe.author && <span>By {recipe.author}</span>}
                          <span>•</span>
                          <span>{recipe.calories} cal</span>
                          <span>•</span>
                          <span>{recipe.protein}g protein</span>
                          <span>•</span>
                          <span>{recipe.carbs}g carbs</span>
                          <span>•</span>
                          <span>{recipe.fats}g fats</span>
                          {recipe.created_at && (
                            <>
                              <span>•</span>
                              <span>Created {recipe.created_at}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap lg:flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(recipe)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Link href={`/recipes/${recipe.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>Update recipe details</DialogDescription>
          </DialogHeader>
          {editingRecipe && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Recipe Name</Label>
                <Input
                  id="edit-name"
                  value={editingRecipe.name}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRecipe.description ?? ""}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-visibility">Visibility</Label>
                <Select
                  value={editingRecipe.visibility}
                  onValueChange={(value) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      visibility: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
