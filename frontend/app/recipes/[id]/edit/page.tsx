"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepsEditor } from "@/components/stepsEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CookingPot } from "lucide-react";
import Link from "next/link";
import { detailRecipe } from "@/lib/detailRecipe";
import { useIngredients } from "@/lib/useIngredients";
import { useUpdateRecipe, type EditRow, type Unit } from "@/lib/useUpdateRecipe";
import RequireAuth from "@/components/RequireAuth";
import { s } from "@/lib/sanitize";

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: recipe, loading, error } = detailRecipe(params.id);
  const { data: ingredientOptions } = useIngredients("");
  const { updateRecipe, loading: saving, error: saveError } = useUpdateRecipe();

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
  const [prepTime, setPrepTime] = useState("0");
  const [cookTime, setCookTime] = useState("0");
  const [servings, setServings] = useState("1");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [rows, setRows] = useState<EditRow[]>([]);

  const ingredientUnitMap = useMemo(() => {
    const m = new Map<number, Unit>();
    ingredientOptions.forEach(i => m.set(i.id, i.serving_unit as Unit));
    return m;
  }, [ingredientOptions]);

  useEffect(() => {
    if (!recipe) return;
    setTitle(recipe.title);
    setVisibility(recipe.visibility);
    setPrepTime(String(recipe.prep_time_minutes ?? 0));
    setCookTime(String(recipe.cook_time_minutes ?? 0));
    setServings(String(recipe.servings));
    setDescription(recipe.description ?? "");
    setSteps(splitSteps(recipe.steps));
    setRows(
      recipe.ingredients.map((ing, idx) => ({
        tempId: idx + 1,
        ingredient_id: ing.id,
        quantity: String(ing.pivot.quantity),
        unit: ing.pivot.unit as Unit,
        notes: ing.pivot.notes ?? "",
      }))
    );
  }, [recipe]);

  function addRow() {
    const nextId = rows.length ? Math.max(...rows.map(r => r.tempId)) + 1 : 1;
    setRows([...rows, { tempId: nextId, ingredient_id: null, quantity: "", unit: "" }]);
  }
  function removeRow(tempId: number) {
    if (rows.length === 1) return;
    setRows(rows.filter(r => r.tempId !== tempId));
  }
  function updateRow(tempId: number, patch: Partial<EditRow>) {
    setRows(rows.map(r => (r.tempId === tempId ? { ...r, ...patch } : r)));
  }

  function splitSteps(steps?: string | null): string[] {
    if (!steps) return [""];
    const lines = steps.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length > 1) return lines;
    const byNumber = steps.split(/\s*\d+\)\s+/).map(s => s.trim()).filter(Boolean);
    return byNumber.length ? byNumber : [steps.trim()];
  }

  function joinSteps(arr: string[]): string {
    return arr.map(s => s.trim()).filter(Boolean).join("\n");
  }

  async function handleSave() {
    if (!recipe) return;

    if (!s.text(title, 255)) return;

    const stepsText = s.multiline(joinSteps(steps), 5000);

    await updateRecipe(recipe.id, {
      title,
      description,
      stepsText,
      visibility,
      servings,
      prepTime,
      cookTime,
      rows,
    });

    // Volver al detalle y refrescar
    router.push(`/recipes/${recipe.id}`);
    // si la página de detalle usa client-fetch (detailRecipe), un push ya re-renderiza;
    // si querés asegurar un fetch nuevo:
    // router.refresh();
  }

  return (
    <RequireAuth>
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CookingPot className="h-8 w-8 text-primary" style={{ color: "#FF9800" }} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit your recipe</h1>
              <p className="text-muted-foreground">Edit the details of your recipe</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/recipes/${params.id}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!loading && !recipe && !error && <div className="text-sm text-muted-foreground">Not found.</div>}

        {recipe && (
          <div className="space-y-8 pt-4">
            {/* Básicos */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Visibility</Label>
                <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                  <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prep (min)</Label>
                <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
              </div>

              <div>
                <Label>Cook (min)</Label>
                <Input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
              </div>

              <div>
                <Label>Servings</Label>
                <Input type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
              </div>

              <div className="md:col-span-3">
                <Label>Description</Label>
                <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <section className="md:col-span-3">
                <StepsEditor value={steps} onChange={setSteps} />
              </section>
            </section>

            {/* Ingredientes */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Ingredients</Label>
                <Button variant="outline" size="sm" onClick={addRow}>Add</Button>
              </div>

              <div className="space-y-3">
                {rows.map((row) => {
                  const autoUnit = row.ingredient_id ? (ingredientUnitMap.get(row.ingredient_id) ?? "") : "";
                  return (
                    <div key={row.tempId} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <div className="md:col-span-5">
                        <Select
                          value={row.ingredient_id ? String(row.ingredient_id) : ""}
                          onValueChange={(val) => {
                            const id = Number(val);
                            const suggest = ingredientUnitMap.get(id) ?? "";
                            updateRow(row.tempId, { ingredient_id: id, unit: (row.unit || suggest) as Unit | "" });
                          }}
                        >
                          <SelectTrigger><SelectValue placeholder="Ingredient" /></SelectTrigger>
                          <SelectContent>
                            {ingredientOptions.map((opt) => (
                              <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.name} <span className="text-xs text-muted-foreground">({opt.serving_unit})</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-3">
                        <Input placeholder="Quantity" value={row.quantity}
                          onChange={(e) => updateRow(row.tempId, { quantity: e.target.value })} />
                      </div>

                      <div className="md:col-span-2">
                        <Select value={row.unit || ""} onValueChange={(v: any) => updateRow(row.tempId, { unit: v })}>
                          <SelectTrigger><SelectValue placeholder={autoUnit || "unit"} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="unit">unit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Button variant="ghost" size="sm"
                          onClick={() => removeRow(row.tempId)} disabled={rows.length === 1}>
                          Remove
                        </Button>
                      </div>

                      <div className="md:col-span-12">
                        <Input placeholder="Notes (optional)" value={row.notes ?? ""}
                          onChange={(e) => updateRow(row.tempId, { notes: e.target.value })} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {saveError && <div className="text-sm text-red-600">Error: {saveError}</div>}

            {/* Botonera duplicada al final para UX */}
            <div className="flex justify-end gap-2">
              <Link href={`/recipes/${params.id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </RequireAuth>
  );
}
