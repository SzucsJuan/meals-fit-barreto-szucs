"use client"

import { AchievementCard } from "@/components/achievement-card"
import { useMyAchievements } from "@/lib/useMyAchievements"
import { AchievementDTO } from "@/lib/api"
import RequireAuth from "@/components/RequireAuth"
import { Loader2 } from "lucide-react"

export default function AchievementsPage() {
    const { achievements, loading, error } = useMyAchievements()

    return (
        <RequireAuth>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-2">Achievements</h1>
                <p className="text-muted-foreground mb-8">
                    Unlock missions by using the app!
                </p>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-red-500">
                        Error loading achievements. Please try again later.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {achievements.map((achievement: AchievementDTO) => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                )}
            </div>
        </RequireAuth>
    )
}
