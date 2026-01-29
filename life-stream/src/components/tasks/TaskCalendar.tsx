"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface TaskCalendarProps {
    tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Get tasks for selected date
    const selectedTasks = tasks.filter((task) => {
        if (!task.due_date || !date) return false;
        // Handle both ISO strings and natural language that might be normalized
        try {
            return isSameDay(new Date(task.due_date), date);
        } catch (e) {
            return false;
        }
    });

    // Function to determine modifiers (e.g., days with tasks)
    const daysWithTasks = tasks.reduce((acc, task) => {
        if (task.due_date && task.status !== 'done') {
            try {
                const d = new Date(task.due_date).toDateString();
                acc[d] = (acc[d] || 0) + 1;
            } catch (e) { }
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
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
                        hasEntry: (d) => !!daysWithTasks[d.toDateString()]
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    }}
                />
            </GlassCard>

            {/* Daily Tasks List */}
            <AnimatePresence mode="popLayout">
                {date && selectedTasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-3"
                    >
                        <h3 className="text-sm font-medium text-white/50 pl-1 uppercase tracking-wider">
                            {format(date, "MMMM do")}
                        </h3>
                        {selectedTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors"
                            >
                                <div className={`p-2 rounded-full ${task.status === 'done' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                                    {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-base font-medium truncate ${task.status === 'done' ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                        {task.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
