import { useEffect, useState } from "react";
import { apiAchievements, type AchievementDTO } from "./api";

export function useMyAchievements() {
  const [achievements, setAchievements] = useState<AchievementDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await apiAchievements.me();
        if (!cancelled) {
          setAchievements(data);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Error al cargar logros");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { achievements, loading, error };
}
