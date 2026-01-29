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
        try {
            return isSameDay(new Date(task.due_date), date);
        } catch (e) {
            return false;
        }
    });

    const pendingTasks = selectedTasks.filter(t => t.status !== 'done');
    const completedTasks = selectedTasks.filter(t => t.status === 'done');

    // Function to determine modifiers
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
        <div className="w-full h-full flex flex-col gap-6">
            <GlassCard className="p-6 w-full">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full border-0"
                    classNames={{
                        month: "w-full space-y-4",
                        caption: "flex justify-center pt-2 relative items-center mb-6",
                        caption_label: "text-2xl font-bold text-white",
                        nav: "flex items-center gap-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between mb-2",
                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm uppercase tracking-wider text-center",
                        row: "flex w-full justify-between mt-2 gap-1",
                        cell: "text-center p-0 relative w-full aspect-square focus-within:relative focus-within:z-20",
                        day: "w-full h-full text-lg p-0 font-medium aria-selected:opacity-100 hover:bg-white/10 rounded-xl transition-all data-[selected]:shadow-xl",
                        day_selected: "bg-purple-600 text-white hover:bg-purple-600 focus:bg-purple-600 focus:text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]",
                        day_today: "bg-white/5 text-accent-foreground border border-white/10",
                        day_outside: "text-muted-foreground opacity-30",
                        day_disabled: "text-muted-foreground opacity-30",
                        day_hidden: "invisible",
                    }}
                    modifiers={{
                        hasEntry: (d) => !!daysWithTasks[d.toDateString()]
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative after:absolute after:bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    }}
                />
            </GlassCard>

            {/* Daily Briefing - Split View */}
            <AnimatePresence mode="popLayout">
                {date && (selectedTasks.length > 0 || pendingTasks.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Pending Operations */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-white/50 pl-1 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Pending Operations
                            </h3>
                            {pendingTasks.length > 0 ? (
                                pendingTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-colors"
                                    >
                                        <div className="p-2 rounded-full bg-white/5 text-purple-400">
                                            <Circle className="w-5 h-5" />
                                        </div>
                                        <p className="text-white/90 font-medium">{task.content}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-8 rounded-xl border border-white/5 border-dashed text-center text-white/20">
                                    <p>No pending operations</p>
                                </div>
                            )}
                        </div>

                        {/* Completed Log */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-white/50 pl-1 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Completed Log
                            </h3>
                            {completedTasks.length > 0 ? (
                                completedTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 flex items-center gap-4"
                                    >
                                        <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <p className="text-white/40 font-medium line-through">{task.content}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-8 rounded-xl border border-white/5 border-dashed text-center text-white/20">
                                    <p>No completed tasks</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
