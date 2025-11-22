"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

import { AchievementDTO } from "@/lib/api"

interface AchievementCardProps {
    achievement: AchievementDTO
}

export function AchievementCard({ achievement }: AchievementCardProps) {
    const isUnlocked = !!achievement.awarded_at

    return (
        <Card className={cn("transition-all duration-300", isUnlocked ? "border-amber-500/50 bg-amber-500/5" : "opacity-70 grayscale")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {achievement.name}
                </CardTitle>
                {isUnlocked ? (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                        <Trophy className="mr-1 h-3 w-3" />
                        Unlocked
                    </Badge>
                ) : (
                    <Badge variant="outline">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-full border-2", isUnlocked ? "border-amber-500 bg-amber-100 dark:bg-amber-900/20" : "border-muted bg-muted")}>
                        {isUnlocked ? <Trophy className="h-6 w-6 text-amber-600" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">
                            {achievement.description}
                        </p>
                        {isUnlocked && (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                                Awarded: {new Date(achievement.awarded_at!).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
