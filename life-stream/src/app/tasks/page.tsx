"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Target, Clock, CheckCircle, ArrowLeft, ListTodo, LayoutGrid, LucideIcon, Calendar as CalendarIcon } from 'lucide-react';
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
            const newTask: Task = {
                id: crypto.randomUUID(),
                user_id: 'user_current', // Placeholder until real auth
                content: data.content,
                status: 'todo',
                priority: data.priority || 'medium',
                due_date: data.date ? new Date(data.date).toISOString() : undefined,
                created_at: new Date().toISOString()
            };
            addTask(newTask);
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
                                                <HardwareScrollCard key={task.id} task={task} />
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

                                        {/* Sector Status (Neural Bento Upgrade) */}
                                        <div className="relative group overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
                                            <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-cyan-400" />
                                                Sector Status
                                            </h3>
                                            <div className="space-y-5 relative z-10">
                                                <MetricRow label="Active Vectors" value={counts.todo} color="text-white" />
                                                <MetricRow label="Neutralized" value={counts.done} color="text-cyan-400" />
                                                <div className="pt-5 mt-5 border-t border-white/10 flex justify-between items-end relative">
                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] uppercase tracking-[0.15em] text-white/40">Total Efficiency</span>
                                                        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${counts.total > 0 ? (counts.done / counts.total) * 100 : 0}%` }}
                                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                                className="h-full bg-cyan-400"
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-3xl font-light tracking-tighter text-white">
                                                        {counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0}<span className="text-lg text-white/30 ml-0.5">%</span>
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
        purple: 'from-purple-500/[0.05] to-purple-500/[0.01] border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.05)]',
        green: 'from-emerald-500/[0.05] to-emerald-500/[0.01] border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]',
        gray: 'from-white/[0.05] to-white/[0.01] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]'
    };

    return (
        <div className={`relative rounded-3xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:scale-[1.01] ${colorMap[color]}`}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`p-2 rounded-xl backdrop-blur-md border ${
                    color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    'bg-white/5 border-white/10 text-white/50'
                }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white/90">{title}</h3>
                <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-sm font-medium text-white/50">
                    {tasks.length}
                </div>
            </div>
            
            <div className="space-y-4 relative z-10 min-h-[150px]">
                <AnimatePresence mode="popLayout">
                    {tasks.map(task => (
                        <HardwareScrollCard key={task.id} task={task} />
                    ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-white/20">
                        Zero Targets
                    </motion.p>
                )}
            </div>
        </div>
    );
}

// God-Tier Hardware Scroll Unrolling Wrapper
function HardwareScrollCard({ task }: { task: Task }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        // Card starts sliding in perfectly tied to physical wheel scrolling at the bottom edge
        offset: ["start 95%", "start 80%"] 
    });
    const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

    return (
        <motion.div 
            layout
            exit={{ opacity: 0, height: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.4, ease: 'circOut' } }}
            ref={ref} 
            style={{ y, opacity, scale }} 
            className="transform-gpu will-change-transform w-full drop-shadow-2xl"
        >
            <TaskCard task={task} />
        </motion.div>
    );
}
