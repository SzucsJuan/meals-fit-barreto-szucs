"use client";

import { useMyAchievements } from "@/lib/useMyAchievements";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navigation from "@/components/navigation";
import Image from "next/image";

export default function AchievementsPage() {
    const { achievements, loading, error } = useMyAchievements();

    if (loading) {
        return (
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Logros</h1>
                <p>Cargando logros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Logros</h1>
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-2">Logros</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Gana logros al registrar tus comidas y crear recetas.
                </p>

                {achievements.length === 0 ? (
                    <p>Aún no hay logros configurados.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {achievements.map((a) => {
                            const awarded = Boolean(a.awarded_at);
                            const awardedDate =
                                a.awarded_at != null
                                    ? format(new Date(a.awarded_at), "d 'de' MMMM yyyy", {
                                        locale: es,
                                    })
                                    : null;

                            return (
                                <div
                                    key={a.id}
                                    className={`relative rounded-xl border p-4 flex flex-col gap-2 ${awarded
                                            ? "border-green-500 bg-green-50/60 dark:bg-green-900/20"
                                            : "border-slate-200 bg-slate-50/60 dark:bg-slate-900/20"
                                        }`}
                                >
                                    {/* Estado */}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${awarded
                                                    ? "bg-green-500 text-white"
                                                    : "bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                                                }`}
                                        >
                                            {awarded ? "Desbloqueado" : "Bloqueado"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        

                                        <div>
                                            <h2 className="font-semibold">{a.name}</h2>
                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                {a.code}
                                            </p>
                                        </div>
                                    </div>

                                    {a.description && (
                                        <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
                                            {a.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-2 text-xs text-slate-600 dark:text-slate-300">
                                        {awarded ? (
                                            <p>Desbloqueado el {awardedDate}</p>
                                        ) : (
                                            <p>Sigue usando la app para desbloquear este logro.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

