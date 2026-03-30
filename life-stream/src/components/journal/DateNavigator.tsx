"use client";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Dream } from "@/types/dream";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="relative overflow-hidden bg-white/[0.03] border border-white/8 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col justify-center">

            <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-white/30" />
                    <h3 className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.45em]">Time Travel</h3>
                </div>
                {selectedDate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10 transition-colors rounded-full"
                        onClick={() => handleSelect(undefined)}
                        title="Clear Time Selection"
                    >
                        <X className="w-3 h-3 text-white/30 hover:text-white/70" />
                    </Button>
                )}
            </div>

            <div className="w-full flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    className="bg-transparent border-0 w-full max-w-full"
                    modifiers={{
                        hasEntry: (date) => datesWithEntries.has(format(date, "yyyy-MM-dd")),
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative font-semibold text-white after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white/40 after:rounded-full",
                    }}
                />
            </div>
        </div>
    );
}
