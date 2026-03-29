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
        <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col justify-center group">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-1000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />

            <div className="flex items-center justify-between mb-2 relative z-10 px-2">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Time Travel</h3>
                </div>
                {selectedDate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-500/20 transition-colors rounded-full"
                        onClick={() => handleSelect(undefined)}
                        title="Clear Time Selection"
                    >
                        <X className="w-3.5 h-3.5 text-white/50 hover:text-red-400" />
                    </Button>
                )}
            </div>

            <div className="relative z-10 w-full flex justify-center custom-calendar-glass">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    className="bg-transparent border-0 w-full max-w-full [&_.rdp-day]:w-9 [&_.rdp-day]:h-9 [&_.rdp-caption]:pt-4"
                    modifiers={{
                        hasEntry: (date) => datesWithEntries.has(format(date, "yyyy-MM-dd")),
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative font-bold text-white z-10 after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-purple-400 after:rounded-full after:shadow-[0_0_8px_rgba(168,85,247,0.8)]",
                        selected: "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/50 hover:bg-purple-500/30",
                    }}
                />
            </div>
        </div>
    );
}
