"use client";

import { useState } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Circle } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import type { Task } from '@/types/task';

export function TaskCalendar() {
    const { tasks } = useTaskStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // Generate days for the grid
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Filter tasks for the selected date
    const selectedTasks = selectedDate
        ? tasks.filter(task => {
            if (!task.due_date) return false;
            // Handle various date formats safely
            try {
                const taskDate = parseISO(task.due_date);
                return isSameDay(taskDate, selectedDate);
            } catch (e) {
                return false;
            }
        })
        : [];

    // Check if a day has tasks
    const getDayLoad = (day: Date) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;
            try {
                return isSameDay(parseISO(task.due_date), day);
            } catch (e) { return false; }
        }).length;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    return (
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    <h2 className="font-semibold text-white">Task Timeline</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-white/80 w-32 text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Calendar Grid */}
                <div className="p-4 border-r border-white/10 border-b md:border-b-0">
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-xs font-medium text-white/40 py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((day, i) => {
                            const load = getDayLoad(day);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                                        ${isSelected ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-white/80'}
                                        ${isToday && !isSelected ? 'border border-purple-500/50' : ''}
                                    `}
                                >
                                    <span className="text-sm">{format(day, 'd')}</span>
                                    {load > 0 && (
                                        <div className="flex gap-0.5 mt-1">
                                            {Array.from({ length: Math.min(load, 3) }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-400'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Task List for Selected Day */}
                <div className="p-4 bg-black/20 min-h-[300px]">
                    <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center justify-between">
                        <span>Tasks for {selectedDate ? format(selectedDate, 'MMM do') : 'Selected Date'}</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">{selectedTasks.length} tasks</span>
                    </h3>

                    <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {selectedTasks.length > 0 ? (
                                selectedTasks.map(task => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-500' :
                                                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${task.status === 'done' ? 'line-through text-white/30' : 'text-white/90'}`}>
                                                    {task.content}
                                                </p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{task.priority}</span>
                                                    {task.status === 'done' && <span className="text-[10px] text-green-400">COMPLETED</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-white/20">
                                    <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No tasks scheduled</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
