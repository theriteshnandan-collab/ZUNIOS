"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Task } from "@/types/task";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface TaskCalendarProps {
    tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Get tasks for selected date
    const selectedTasks = tasks.filter((task) => {
        if (!task.date || !date) return false;
        // Handle both ISO strings and natural language that might be normalized
        try {
            return isSameDay(new Date(task.date), date);
        } catch (e) {
            return false;
        }
    });

    // Function to determine modifiers (e.g., days with tasks)
    const daysWithTasks = tasks.reduce((acc, task) => {
        if (task.date && !task.completed) {
            try {
                const d = new Date(task.date).toDateString();
                acc[d] = (acc[d] || 0) + 1;
            } catch (e) { }
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="w-full max-w-xl mx-auto">
            <GlassCard className="p-6 flex items-center justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-0"
                    classNames={{
                        month: "space-y-4 w-full",
                        caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-lg font-medium",
                        head_row: "flex w-full justify-between mt-2",
                        head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem] uppercase tracking-wider",
                        row: "flex w-full justify-between mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-full transition-all",
                        day_selected: "bg-purple-500 text-white hover:bg-purple-600 focus:bg-purple-600 focus:text-white",
                        day_today: "bg-white/5 text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                    }}
                    modifiers={{
                        hasTask: (d) => !!daysWithTasks[d.toDateString()]
                    }}
                    modifiersClassNames={{
                        hasTask: "relative after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    }}
                />
            </GlassCard>

            {/* Optional Summary Below - Removed per request "No operations scheduled thing" */}
        </div>
    );
}
