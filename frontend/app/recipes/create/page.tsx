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
import { ChefHat, Plus, Minus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useIngredients as useIngredientsHook } from "@/lib/useIngredients";
import { useCreateRecipe, type FormRow, type Unit } from "@/lib/useCreateRecipe";

export default function CreateRecipePage() {
  const router = useRouter();
  const { data: ingredientOptions } = useIngredientsHook(""); // usa tu hook
  const { createRecipe, loading, error } = useCreateRecipe();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public"|"unlisted"|"private">("public");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");

  const [rows, setRows] = useState<FormRow[]>([
    { tempId: 1, ingredient_id: null, quantity: "", unit: "" }
  ]);

  const [steps, setSteps] = useState<{ id:number; step:string }[]>([{ id: 1, step: "" }]);

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

  const handleSave = async () => {
    // autocompletar unidad por defecto si el user no eligió
    const normalized = rows.map(r => ({
      ...r,
      unit: (r.unit || (r.ingredient_id ? (ingredientUnitMap.get(r.ingredient_id) ?? '') : '')) as Unit | ''
    }));

    try {
      await createRecipe({
        title,
        description,
        stepsList: steps.map(s => s.step),
        visibility,
        servings,
        prepTime,
        cookTime,
        rows: normalized,
      });
      router.push("/recipes");
    } catch {
      // el hook ya setea error visible
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
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
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Name</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={visibility} onValueChange={(v:any) => setVisibility(v)}>
                    <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
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
            <CardHeader>
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
                          updateRow(row.tempId, { ingredient_id: id, unit: (row.unit || autoUnit) as Unit|'' });
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
                      <Select value={row.unit || ''} onValueChange={(v:any) => updateRow(row.tempId, { unit: v })}>
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
            <CardHeader>
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
  );
}
