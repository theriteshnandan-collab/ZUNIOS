"use client";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Dream } from "@/types/dream";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar as CalendarIcon } from "lucide-react";

interface DateNavigatorProps {
    dreams: Dream[];
    onDateSelect: (date: Date) => void;
}

export function DateNavigator({ dreams, onDateSelect }: DateNavigatorProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Create a Set of date strings "YYYY-MM-DD" that have entries
    const datesWithEntries = new Set(
        dreams.map(d => format(new Date(d.created_at), "yyyy-MM-dd"))
    );

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            onDateSelect(date);
        }
    };

    return (
        <GlassCard className="p-2 border-white/5 space-y-1 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-medium text-white/70">Time Travel</h3>
                </div>
                {selectedDate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={() => handleSelect(undefined)}
                    >
                        <X className="w-4 h-4 text-white/50" />
                    </Button>
                )}
            </div>

            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                className="rounded-md border border-white/5 bg-black/20"
                modifiers={{
                    hasEntry: (date) => datesWithEntries.has(format(date, "yyyy-MM-dd")),
                }}
                modifiersClassNames={{
                    hasEntry: "bg-purple-500/20 font-bold text-purple-300 hover:bg-purple-500/40",
                }}
            />
        </GlassCard>
    );
}
