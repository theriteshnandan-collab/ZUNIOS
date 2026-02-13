"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, ArrowLeft, LayoutGrid, LucideIcon, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd';
import TaskCommandCenter from '@/components/tasks/TaskCommandCenter';
import type { Task } from '@/types/task';
import TaskCalendarComponent from '@/components/tasks/TaskCalendar';
import { toast } from 'sonner';
import { isSameCalendarDay } from '@/lib/date-utils';

type ViewMode = 'list' | 'kanban' | 'calendar';

function parseDueDateValue(value?: string) {
    if (!value || typeof value !== 'string') return undefined;

    const normalized = value.trim().toLowerCase();
    const now = new Date();

    if (normalized === 'tomorrow') {
        const date = new Date(now);
        date.setDate(date.getDate() + 1);
        return date.toISOString();
    }

    if (normalized === 'next friday') {
        const date = new Date(now);
        const dayOfWeek = date.getDay();
        const target = 5;
        let delta = (target - dayOfWeek + 7) % 7;
        if (delta === 0) delta = 7;
        date.setDate(date.getDate() + delta);
        return date.toISOString();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}


export default function TasksPage() {
    const { tasks, isLoading, fetchTasks, getTaskCount, addTask, toggleComplete, deleteTask } = useTaskStore();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

    // CALENDAR CONNECTION: Lifted State
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const counts = getTaskCount();

    // UNIFIED FILTERING: Status + Date
    const filteredTasks = tasks.filter(task => {
        // 1. Filter by Status
        const statusMatch = filter === 'all' ? true : task.status === filter;
        if (!statusMatch) return false;

        // 2. Filter by Date (if selected)
        if (selectedDate) {
            // Strict YYYY-MM-DD comparison using imported utility
            return isSameCalendarDay(task.due_date, selectedDate);
        }

        return true;
    });

    // Kanban Buckets
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const doneTasks = tasks.filter(t => t.status === 'done');

    const handleCommandExecuted = (result: any) => {
        const { action, data } = result;

        if (action === 'create') {
            const parsedDueDate = parseDueDateValue(data.due_date);
            addTask({
                content: data.content,
                priority: data.priority || 'medium',
                due_date: parsedDueDate
            });
            toast.success("Task Deployed", { description: data.content });
        }
        else if (action === 'complete' || action === 'delete') {
            const targetContent = data.content.toLowerCase();
            const matchedTask = tasks.find(t => t.content.toLowerCase().includes(targetContent));

            if (matchedTask) {
                if (action === 'complete') {
                    toggleComplete(matchedTask.id);
                    toast.success("Target Neutralized", { description: `Completed: ${matchedTask.content}` });
                } else {
                    deleteTask(matchedTask.id);
                    toast.info("Target Eliminated", { description: `Deleted: ${matchedTask.content}` });
                }
            } else {
                toast.error("Target Not Found", { description: `Could not locate "${data.content}" in sector.` });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/journal"
                                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Target className="w-6 h-6 text-cyan-500" />
                                    Mission Control
                                </h1>
                                <p className="text-sm text-white/50">Turn thoughts into action</p>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/40 hover:text-white'}`}
                                title="Board View"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/40 hover:text-white'}`}
                                title="Calendar View"
                            >
                                <CalendarIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* AI Command Center */}
                <TaskCommandCenter onCommandExecuted={handleCommandExecuted} />

                {/* View Render */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {viewMode === 'kanban' ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <KanbanColumn title="To Do" tasks={todoTasks} color="gray" icon={Target} />
                                <KanbanColumn title="Done" tasks={doneTasks} color="green" icon={CheckCircle} />
                            </div>
                        ) : (
                            /* Unified Dashboard View (Default) */
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left: Task Feed - CONTROLLED BY CALENDAR */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-white/80 pl-1 flex items-center gap-2">
                                            {selectedDate ? (
                                                <>
                                                    <span className="text-cyan-400">Briefing:</span>
                                                    {filteredTasks.length > 0 ? "Active Missions" : "No Missions"}
                                                </>
                                            ) : (
                                                "All Missions"
                                            )}
                                        </h2>
                                        {selectedDate && (
                                            <button
                                                onClick={() => setSelectedDate(undefined)}
                                                className="text-xs uppercase tracking-wider text-cyan-400 hover:text-white transition-colors"
                                            >
                                                Show All
                                            </button>
                                        )}
                                    </div>

                                    <div className="hidden lg:flex items-center gap-2 mb-4">
                                        <FilterBadge label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                                        <FilterBadge label="To Do" active={filter === 'todo'} onClick={() => setFilter('todo')} />
                                        <FilterBadge label="Done" active={filter === 'done'} onClick={() => setFilter('done')} />
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {filteredTasks.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-20 border border-white/5 rounded-2xl bg-white/5"
                                            >
                                                <Target className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                                <p className="text-white/50 mb-2">
                                                    {selectedDate ? "No operations scheduled for this day." : "No tasks found."}
                                                </p>
                                                <p className="text-sm text-white/30">Create a new mission above</p>
                                                {selectedDate && (
                                                    <button
                                                        onClick={() => setSelectedDate(undefined)}
                                                        className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
                                                    >
                                                        View All History
                                                    </button>
                                                )}
                                            </motion.div>
                                        ) : (
                                            filteredTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} />
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Right: Tactical Calendar (Sticky) - NOW THE CONTROLLER */}
                                <div className="space-y-6">
                                    <div className="sticky top-24 space-y-6">
                                        <TaskCalendarComponent
                                            tasks={tasks}
                                            selectedDate={selectedDate}
                                            onSelectDate={setSelectedDate}
                                        />

                                        {/* Sector Status */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Sector Status</h3>
                                            <div className="space-y-4">
                                                <MetricRow label="Pending" value={counts.todo} color="text-white" />

                                                <MetricRow label="Complete" value={counts.done} color="text-emerald-400" />
                                                <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-sm text-white/40">Total Efficiency</span>
                                                    <span className="text-xl font-bold text-white">
                                                        {counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Quick Add FAB */}
            <TaskQuickAdd />
        </div>
    );
}

// Minimal Components
function FilterBadge({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${active
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
        >
            {label}
        </button>
    );
}

function MetricRow({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">{label}</span>
            <span className={`font-mono font-bold ${color}`}>{value}</span>
        </div>
    );
}

// Kanban Column Component
function KanbanColumn({ title, tasks, color, icon: Icon }: {
    title: string;
    tasks: Task[];
    color: 'purple' | 'green' | 'gray';
    icon: LucideIcon;
}) {
    const colorMap = {
        purple: 'border-purple-500/30 bg-purple-500/5',
        green: 'border-green-500/30 bg-green-500/5',
        gray: 'border-white/10 bg-white/5'
    };

    return (
        <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-white/40'}`} />
                <h3 className="font-semibold text-white">{title}</h3>
                <span className="ml-auto text-sm text-white/40">{tasks.length}</span>
            </div>
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                    <p className="text-sm text-white/30 text-center py-8">No tasks</p>
                )}
            </div>
        </div>
    );
}
