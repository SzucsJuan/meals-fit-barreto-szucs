"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Save, Beef } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIngredients as useIngredientsHook } from "@/lib/useIngredients";
import { useCreateRecipe, type FormRow, type Unit } from "@/lib/useCreateRecipe";
import RequireAuth from "@/components/RequireAuth";
import Image from "next/image";
import { apiRecipeImages } from "@/lib/api";

export default function CreateRecipePage() {
  const router = useRouter();
  const { data: ingredientOptions } = useIngredientsHook("");
  const { createRecipe, loading, error } = useCreateRecipe();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [rows, setRows] = useState<FormRow[]>([
    { tempId: 1, ingredient_id: null, quantity: "", unit: "" }
  ]);

  const [steps, setSteps] = useState<{ id: number; step: string }[]>([{ id: 1, step: "" }]);

  const ingredientUnitMap = useMemo(() => {
    const m = new Map<number, Unit>();
    ingredientOptions.forEach(i => m.set(i.id, i.serving_unit as Unit));
    return m;
  }, [ingredientOptions]);

  const addRow = () => {
    const nextId = Math.max(...rows.map(r => r.tempId)) + 1;
    setRows([...rows, { tempId: nextId, ingredient_id: null, quantity: "", unit: "" }]);
  };
  const removeRow = (tempId: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter(r => r.tempId !== tempId));
  };
  const updateRow = (tempId: number, patch: Partial<FormRow>) => {
    setRows(rows.map(r => r.tempId === tempId ? { ...r, ...patch } : r));
  };

  const addStep = () => {
    const nextId = Math.max(...steps.map(s => s.id)) + 1;
    setSteps([...steps, { id: nextId, step: "" }]);
  };
  const removeStep = (id: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter(s => s.id !== id));
  };
  const updateStep = (id: number, step: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, step } : s));
  };

    function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return alert("Formato no soportado (usa JPG/PNG/WebP).");
    if (f.size > 5 * 1024 * 1024) return alert("Máximo 5MB.");
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
  }

  const handleSave = async () => {
    const normalized = rows.map(r => ({
      ...r,
      unit: (r.unit || (r.ingredient_id ? (ingredientUnitMap.get(r.ingredient_id) ?? '') : '')) as Unit | ''
    }));

    try {
      const created = await createRecipe({
        title,
        description,
        stepsList: steps.map(s => s.step),
        visibility,
        servings,
        prepTime,
        cookTime,
        rows: normalized,
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

      router.push("/recipes");
    } catch {
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Header */}
        <div className="border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Beef className="h-8 w-8 text-primary" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Create New Recipe</h1>
                  <p className="text-muted-foreground">Share your healthy creations</p>
                </div>
              </div>
              <Link href="/recipes">
                <Button variant="outline">Back to Recipes</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Name</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                      <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Prep Time (min)</Label>
                    <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cook Time (min)</Label>
                    <Input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Servings</Label>
                    <Input type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Ingredients</CardTitle>
                    <CardDescription>Select ingredients and amounts</CardDescription>
                  </div>
                  <Button onClick={addRow} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {rows.map((row) => {
                  const selected = ingredientOptions.find(i => i.id === row.ingredient_id || 0);
                  const defaultUnit = selected?.serving_unit ?? '';
                  return (
                    <div key={row.tempId} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-6">
                        <Label>Ingredient</Label>
                        <Select
                          value={row.ingredient_id ? String(row.ingredient_id) : ""}
                          onValueChange={(val) => {
                            const id = Number(val);
                            const autoUnit = ingredientUnitMap.get(id) ?? '';
                            updateRow(row.tempId, { ingredient_id: id, unit: (row.unit || autoUnit) as Unit | '' });
                          }}
                        >
                          <SelectTrigger><SelectValue placeholder="Select ingredient" /></SelectTrigger>
                          <SelectContent>
                            {ingredientOptions.map(opt => (
                              <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.name} <span className="text-xs text-muted-foreground">({opt.serving_unit})</span>
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
                          onChange={(e) => updateRow(row.tempId, { quantity: e.target.value })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Unit</Label>
                        <Select value={row.unit || ''} onValueChange={(v: any) => updateRow(row.tempId, { unit: v })}>
                          <SelectTrigger><SelectValue placeholder={defaultUnit || "unit"} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="unit">unit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-1 flex items-end">
                        <Button onClick={() => removeRow(row.tempId)} size="sm" variant="ghost" disabled={rows.length === 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="md:col-span-12">
                        <Input
                          placeholder="Notes (optional)"
                          value={row.notes ?? ''}
                          onChange={(e) => updateRow(row.tempId, { notes: e.target.value })}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Instructions */}
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
                {steps.map((st, idx) => (
                  <div key={st.id} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-2 min-w-fit">Step {idx + 1}</Badge>
                    <Textarea value={st.step} onChange={(e) => updateStep(st.id, e.target.value)} placeholder="Describe this step" />
                    <Button onClick={() => removeStep(st.id)} size="sm" variant="ghost" disabled={steps.length === 1} className="mt-2">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pt-4">
                <CardTitle>Recipe Image</CardTitle>
                <CardDescription>Subí una imagen (JPG/PNG/WebP · máx 5MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={[
                    "rounded-2xl border border-dashed p-4 md:p-5",
                    dragOver ? "border-orange-400 ring-2 ring-orange-300/50" : "border-muted"
                  ].join(" ")}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (!f) return;
                    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return alert("Formato no soportado.");
                    if (f.size > 5 * 1024 * 1024) return alert("Máximo 5MB.");
                    setImageFile(f);
                    const url = URL.createObjectURL(f);
                    setImagePreview(url);
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Preview cuadrado */}
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
                            onClick={() => document.getElementById("create-image-input")?.click()}
                            className="absolute inset-0 grid place-items-center text-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                          >
                            <div className="flex flex-col items-center gap-2 px-6">
                              <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-70"><path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                              <span>
                                Arrastrá una imagen acá, o <span className="text-orange-600 underline">explorá</span>
                              </span>
                              <span className="text-xs opacity-70">JPG, PNG o WebP · Máx 5MB</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          id="create-image-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={pickFile}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById("create-image-input")?.click()}
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                                    bg-orange-600 text-white hover:bg-orange-700"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                            <path strokeWidth="1.5" d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" />
                            <path strokeWidth="1.5" d="m7 17 3.5-3.5a1 1 0 0 1 1.4 0L15 16l2-2 2 2" />
                            <circle cx="9" cy="9" r="1.25" />
                          </svg>
                          {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                        </button>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("¿Quitar la imagen seleccionada?")) clearImage();
                            }}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                                      border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                              <path strokeWidth="1.5" strokeLinecap="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            </svg>
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

            {/* Save */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="flex items-center gap-2" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Recipe'}
              </Button>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
