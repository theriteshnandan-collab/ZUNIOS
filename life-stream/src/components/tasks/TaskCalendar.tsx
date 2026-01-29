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
        <div className="grid md:grid-cols-12 gap-6">
            {/* Calendar Side */}
            <div className="md:col-span-5 lg:col-span-4">
                <GlassCard className="p-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full"
                        modifiers={{
                            hasTask: (d) => !!daysWithTasks[d.toDateString()]
                        }}
                        modifiersClassNames={{
                            hasTask: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-purple-500 after:rounded-full"
                        }}
                    />
                </GlassCard>
            </div>

            {/* Agenda Side */}
            <div className="md:col-span-7 lg:col-span-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-serif text-white/80">
                        {date ? format(date, "MMMM do, yyyy") : "Select a date"}
                    </h3>

                    <AnimatePresence mode="popLayout">
                        {selectedTasks.length > 0 ? (
                            selectedTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:bg-white/10 transition-colors"
                                >
                                    <div className={`p-2 rounded-full ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'}`}>
                                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </div>

                                    <div className="flex-1">
                                        <p className={`text-base ${task.completed ? 'text-white/30 line-through' : 'text-white/90'}`}>
                                            {task.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {task.priority === 'high' && (
                                                <span className="text-xs text-red-400 font-medium px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                                    High Priority
                                                </span>
                                            )}
                                            <span className="text-xs text-white/30 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Due {task.date ? format(new Date(task.date), "h:mm a") : "All Day"}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 opacity-40">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-white/20" />
                                <p>No operations scheduled for this sector.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
