"use client";

import { useMyAchievements } from "@/lib/useMyAchievements";
import Navigation from "@/components/navigation";
import RequireAuth from "@/components/RequireAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

export default function AchievementsPage() {
  const { achievements, loading, error } = useMyAchievements();

  const awardedCount = achievements.filter((a) => !!a.awarded_at).length;
  const totalCount = achievements.length;

  return (
    <RequireAuth>
      <div className="bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" style={{ color: "#FF9800" }} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Achievements
                </h1>
                <p className="text-muted-foreground">
                  Earn achievements by logging your meals, creating recipes,
                  and more.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pt-4 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Tu progreso</CardTitle>
                  <CardDescription className="text-sm">
                    Has desbloqueado {awardedCount} de {totalCount || 0} logros
                    disponibles.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="self-start sm:self-auto">
                  {awardedCount}/{totalCount || 0} desbloqueados
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {loading && (
                <p className="text-sm text-muted-foreground">
                  Cargando logros...
                </p>
              )}

              {error && !loading && (
                <p className="text-sm text-red-600">Error: {error}</p>
              )}

              {!loading && !error && (
                <>
                  {achievements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aún no hay logros configurados.
                    </p>
                  ) : (
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {achievements.map((a) => {
                        const awarded = Boolean(a.awarded_at);
                        const awardedDate =
                          a.awarded_at != null
                            ? format(
                                new Date(a.awarded_at),
                                "d 'de' MMMM yyyy",
                                { locale: es }
                              )
                            : null;

                        return (
                          <article
                            key={a.id}
                            className={`relative rounded-xl border p-5 flex flex-col shadow-sm transition
                              ${
                                awarded
                                  ? "border-green-500 bg-green-50/80 dark:bg-green-900/20"
                                  : "border-border bg-card"
                              }`}
                          >
                            <div className="absolute top-3 right-3">
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full
                                  ${
                                    awarded
                                      ? "bg-green-500 text-white"
                                      : "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                                  }`}
                              >
                                {awarded ? "Desbloqueado" : "Bloqueado"}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              {a.icon_url ? (
                                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/80 flex-shrink-0">
                                  <Image
                                    src={a.icon_url}
                                    alt={a.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                                  🏅
                                </div>
                              )}

                              <div>
                                <h2 className="text-base font-semibold leading-snug">
                                  {a.name}
                                </h2>
                                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                  {a.code}
                                </p>
                              </div>
                            </div>

                            {a.description && (
                              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
                                {a.description}
                              </p>
                            )}

                            <div className="mt-auto pt-3 border-t border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                              {awarded ? (
                                <p>Desbloqueado el {awardedDate}</p>
                              ) : (
                                <p>Aún no desbloqueado</p>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </section>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
