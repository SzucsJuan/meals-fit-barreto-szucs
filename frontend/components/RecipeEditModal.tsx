"use client";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateRecipe, type EditRow, type Unit } from "@/lib/useUpdateRecipe";
import { useIngredients } from "@/lib/useIngredients";
import type { RecipeDTO } from "@/lib/api";

export function RecipeEditModal({
  open, onClose, recipe, onUpdated
}: {
  open: boolean;
  onClose: () => void;
  recipe: RecipeDTO;
  onUpdated: () => void; // para refrescar la vista
}) {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description ?? "");
  const [visibility, setVisibility] = useState<"public"|"unlisted"|"private">(recipe.visibility);
  const [prepTime, setPrepTime] = useState(String(recipe.prep_time_minutes ?? 0));
  const [cookTime, setCookTime] = useState(String(recipe.cook_time_minutes ?? 0));
  const [servings, setServings] = useState(String(recipe.servings));
  const [stepsText, setStepsText] = useState(recipe.steps ?? "");

  // mapear ingredientes existentes a filas editables
  const [rows, setRows] = useState<EditRow[]>(() =>
    recipe.ingredients.map((ing, idx) => ({
      tempId: idx + 1,
      ingredient_id: ing.id,
      quantity: String(ing.pivot.quantity),
      unit: ing.pivot.unit as Unit,
      notes: ing.pivot.notes ?? "",
    }))
  );

  const { updateRecipe, loading, error } = useUpdateRecipe();
  const { data: ingredientOptions } = useIngredients("");

  const ingredientUnitMap = useMemo(() => {
    const m = new Map<number, Unit>();
    ingredientOptions.forEach(i => m.set(i.id, i.serving_unit as Unit));
    return m;
  }, [ingredientOptions]);

  useEffect(() => {
    if (!open) return;
    // sincronizar si llega otra recipe (navegación sin cerrar)
    setTitle(recipe.title);
    setDescription(recipe.description ?? "");
    setVisibility(recipe.visibility);
    setPrepTime(String(recipe.prep_time_minutes ?? 0));
    setCookTime(String(recipe.cook_time_minutes ?? 0));
    setServings(String(recipe.servings));
    setStepsText(recipe.steps ?? "");
    setRows(recipe.ingredients.map((ing, idx) => ({
      tempId: idx + 1,
      ingredient_id: ing.id,
      quantity: String(ing.pivot.quantity),
      unit: ing.pivot.unit as Unit,
      notes: ing.pivot.notes ?? "",
    })));
  }, [open, recipe]);

  const addRow = () => {
    const nextId = rows.length ? Math.max(...rows.map(r => r.tempId)) + 1 : 1;
    setRows([...rows, { tempId: nextId, ingredient_id: null, quantity: "", unit: "" }]);
  };
  const removeRow = (tempId: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter(r => r.tempId !== tempId));
  };
  const updateRow = (tempId: number, patch: Partial<EditRow>) => {
    setRows(rows.map(r => r.tempId === tempId ? { ...r, ...patch } : r));
  };

  async function handleSave() {
    await updateRecipe(recipe.id, {
      title, description, stepsText, visibility,
      servings, prepTime, cookTime,
      rows, // si querés no tocar ingredientes, mandá rows: undefined
    });
    onUpdated();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v ? onClose() : null}>
      <DialogContent
  className="
    w-[96vw] sm:w-[90vw] lg:w-[80vw] xl:w-[70vw] 2xl:w-[60vw]
    max-w-none
    max-h-[90vh]
    overflow-y-auto overscroll-contain
    p-0
  "
>
  {/* Header sticky opcional */}
  <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
    <DialogHeader>
      <DialogTitle>Edit Recipe</DialogTitle>
      <DialogDescription>Update fields and save your changes</DialogDescription>
    </DialogHeader>
  </div>

  {/* Contenido scrolleable */}
  <div className="px-6 py-5 space-y-6">
    {/* GRID más compacto */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Visibility</Label>
        <Select value={visibility} onValueChange={(v:any) => setVisibility(v)}>
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
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="md:col-span-3">
        <Label>Steps (one per line)</Label>
        <Textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={6} />
      </div>
    </div>

    {/* INGREDIENTES con scroll propio si querés */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Ingredients</Label>
        <Button variant="outline" size="sm" onClick={addRow}>Add</Button>
      </div>

      {/* Si la lista puede ser larga, scroll en este bloque */}
      <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-3">
        {rows.map((row) => (
          <div key={row.tempId} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-6">
              <Select
                value={row.ingredient_id ? String(row.ingredient_id) : ""}
                onValueChange={(val) => {
                  const id = Number(val);
                  const suggest = ingredientUnitMap.get(id) ?? '';
                  updateRow(row.tempId, { ingredient_id: id, unit: (row.unit || suggest) as any });
                }}
              >
                <SelectTrigger><SelectValue placeholder="Ingredient" /></SelectTrigger>
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
              <Input placeholder="Quantity" value={row.quantity}
                     onChange={(e) => updateRow(row.tempId, { quantity: e.target.value })} />
            </div>

            <div className="md:col-span-2">
              <Select value={row.unit || ''} onValueChange={(v:any) => updateRow(row.tempId, { unit: v })}>
                <SelectTrigger><SelectValue placeholder="unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="unit">unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Button variant="ghost" size="sm" onClick={() => removeRow(row.tempId)} disabled={rows.length === 1}>
                Remove
              </Button>
            </div>

            <div className="md:col-span-12">
              <Input placeholder="Notes (optional)" value={row.notes ?? ''}
                     onChange={(e) => updateRow(row.tempId, { notes: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Footer sticky siempre visible */}
  <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4">
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  </div>
</DialogContent>
    </Dialog>
  );
}
