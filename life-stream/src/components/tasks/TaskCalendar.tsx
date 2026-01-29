import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types/task";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { isSameCalendarDay, normalizeDateKey, formatCalendarDate } from "@/lib/date-utils";

interface TaskCalendarProps {
    tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
    // Initialize with today's date
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Filter tasks securely using our new strict utility
    const selectedTasks = tasks.filter((task) => {
        return isSameCalendarDay(task.due_date, date);
    });

    const pendingTasks = selectedTasks.filter(t => t.status !== 'done');
    const completedTasks = selectedTasks.filter(t => t.status === 'done');

    // Pre-calculate days with tasks map for O(1) lookup during render
    const taskDayMap = tasks.reduce((acc, task) => {
        if (task.status !== 'done') {
            const key = normalizeDateKey(task.due_date);
            if (key) {
                acc[key] = (acc[key] || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <GlassCard className="p-6 w-full flex-shrink-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full border-0 select-none"
                    classNames={{
                        month: "w-full space-y-4",
                        caption: "flex justify-center pt-2 relative items-center mb-6",
                        caption_label: "text-xl font-bold text-white tracking-tight",
                        nav: "flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity",

                        // Grid Layout
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full justify-between mb-4",
                        head_cell: "text-muted-foreground w-full font-medium text-xs uppercase tracking-widest text-center",
                        row: "flex w-full justify-between mt-2 gap-2",

                        // Individual Cells - MAXIMIZED TOUCH TARGETS
                        cell: "text-center p-0 relative w-full aspect-square focus-within:relative focus-within:z-20",
                        day: "w-full h-full text-lg p-0 font-medium text-white/70 hover:bg-white/10 rounded-2xl transition-all data-[selected]:shadow-2xl",

                        // States
                        day_selected: "bg-purple-600 text-white hover:bg-purple-500 hover:text-white focus:bg-purple-600 focus:text-white shadow-[0_0_25px_rgba(147,51,234,0.5)] scale-105 z-10",
                        day_today: "bg-white/5 text-white border border-white/20",
                        day_outside: "text-muted-foreground/20 opacity-20",
                        day_disabled: "text-muted-foreground opacity-20",
                        day_hidden: "invisible",
                    }}
                    modifiers={{
                        hasEntry: (d) => !!taskDayMap[normalizeDateKey(d) || '']
                    }}
                    modifiersClassNames={{
                        hasEntry: "relative after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_10px_rgba(52,211,153,0.8)]"
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
                        className="grid lg:grid-cols-2 gap-4 flex-grow overflow-auto"
                    >
                        {/* Pending Operations */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-white/40 pl-1 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                                Pending [{pendingTasks.length}]
                            </h3>
                            <div className="space-y-2">
                                {pendingTasks.length > 0 ? (
                                    pendingTasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            className="group bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-3 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-default"
                                        >
                                            <div className="mt-1 p-1.5 rounded-full bg-white/5 text-purple-400 group-hover:scale-110 transition-transform">
                                                <Circle className="w-4 h-4" />
                                            </div>
                                            <p className="text-white/80 text-sm font-medium leading-relaxed pt-0.5">{task.content}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-6 rounded-xl border border-white/5 border-dashed text-center text-white/20 bg-white/[0.02]">
                                        <p className="text-sm">No pending operations</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Completed Log */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-white/40 pl-1 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                Completed [{completedTasks.length}]
                            </h3>
                            <div className="space-y-2">
                                {completedTasks.length > 0 ? (
                                    completedTasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-3 flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity"
                                        >
                                            <div className="mt-1 p-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <p className="text-white/40 text-sm font-medium leading-relaxed line-through pt-0.5">{task.content}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-6 rounded-xl border border-white/5 border-dashed text-center text-white/20 bg-white/[0.02]">
                                        <p className="text-sm">No completed tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
