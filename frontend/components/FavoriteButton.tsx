"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToggleFavorite } from "@/lib/useToggleFavorite";

type Props = {
  recipeId: number;
  initialFavorited?: boolean;
  onChange?: (isFavorited: boolean) => void; 
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
};

export default function FavoriteButton({
  recipeId,
  initialFavorited = false,
  onChange,
  className,
  size = "sm",
}: Props) {
  const [favorited, setFavorited] = useState<boolean>(initialFavorited);
  const { toggle, loading } = useToggleFavorite();

  async function onClick() {
    const prev = favorited;
    setFavorited(!prev);
    try {
      const { isFavorited } = await toggle(recipeId, prev);
      setFavorited(isFavorited);
      onChange?.(isFavorited);
    } catch {
      // si falla se revierte
      setFavorited(prev);
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={className}
      onClick={onClick}
      disabled={loading}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-4 w-4 ${favorited ? "text-destructive" : "text-muted-foreground"}`} />
    </Button>
  );
}
