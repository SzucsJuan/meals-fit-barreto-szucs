export interface IngredientPivot {
  id: number;
  name: string;
  pivot: {
    quantity: number;
    unit: string;
    notes?: string | null;
  };
}

export interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  steps?: string | null;
  visibility: "public" | "unlisted" | "private";
  user?: { id: number; name: string };
  ingredients: IngredientPivot[];
  image_url?: string | null;
  avg_rating?: number | null;
  votes_count?: number;
  favorited_by_count?: number;
}
