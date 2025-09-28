"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";

export function StepsEditor({
    value,
    onChange,
    title = "Instructions",
    subtitle = "Step-by-step",
    className = "",
}: {
    value: string[];
    onChange: (next: string[]) => void;
    title?: string;
    subtitle?: string;
    className?: string;
}) {
    const genId = useId();

    const add = () => onChange([...value, ""]);
    const remove = (idx: number) => {
        const next = value.slice();
        next.splice(idx, 1);
        onChange(next.length ? next : [""]);
    };
    const update = (idx: number, v: string) => {
        const next = value.slice();
        next[idx] = v;
        onChange(next);
    };

    return (
        <div className={`w-full rounded-2xl border bg-muted/40 p-4 md:p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <Label className="text-base">{title}</Label>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1">
                    <Plus className="h-4 w-4" /> Add Step
                </Button>
            </div>

            <div className="space-y-3">
                {value.map((step, idx) => (
                    <div key={`${genId}-${idx}`} className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-2 min-w-fit">Step {idx + 1}</Badge>
                        <Textarea
                            value={step}
                            onChange={(e) => update(idx, e.target.value)}
                            placeholder="Describe this step"
                            className="flex-1 min-h-[100px] resize-y"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(idx)}
                            disabled={value.length === 1}
                            className="mt-2"
                            aria-label="Remove step"
                            title="Remove step"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
