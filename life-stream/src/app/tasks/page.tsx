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
        <div className="min-h-screen bg-[#050505] selection:bg-white/20">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/journal"
                                className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                                    <Target className="w-6 h-6 text-white" />
                                    Mission Control
                                </h1>
                                <p className="text-sm text-zinc-500 font-medium">Turn thoughts into action</p>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                title="Board View"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
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
                        <div className="animate-spin w-8 h-8 border-[3px] border-white/20 border-t-white rounded-full" />
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {viewMode === 'kanban' ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <KanbanColumn title="To Do" tasks={todoTasks} icon={Target} />
                                <KanbanColumn title="Done" tasks={doneTasks} icon={CheckCircle} />
                            </div>
                        ) : (
                            /* Unified Dashboard View (Default) */
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left: Task Feed - CONTROLLED BY CALENDAR */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight text-white pl-1 flex items-center gap-2">
                                            {selectedDate ? (
                                                <>
                                                    <span className="text-white/60">Briefing:</span>
                                                    {filteredTasks.length > 0 ? "Active Missions" : "No Missions"}
                                                </>
                                            ) : (
                                                "All Missions"
                                            )}
                                        </h2>
                                        {selectedDate && (
                                            <button
                                                onClick={() => setSelectedDate(undefined)}
                                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                                            >
                                                Show All
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <FilterBadge label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                                        <FilterBadge label="To Do" active={filter === 'todo'} onClick={() => setFilter('todo')} />
                                        <FilterBadge label="Done" active={filter === 'done'} onClick={() => setFilter('done')} />
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {filteredTasks.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-24 border border-white/5 rounded-3xl bg-white/[0.02]"
                                            >
                                                <Target className="w-16 h-16 text-white/10 mx-auto mb-6" />
                                                <p className="text-white/50 mb-2 font-medium">
                                                    {selectedDate ? "No operations scheduled for this day." : "No tasks found."}
                                                </p>
                                                <p className="text-xs text-zinc-600">Create a new mission above</p>
                                                {selectedDate && (
                                                    <button
                                                        onClick={() => setSelectedDate(undefined)}
                                                        className="mt-6 px-6 py-2 border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold uppercase tracking-widest text-white transition-colors"
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

                                        {/* Sector Status (Neural Bento Upgrade - Monochrome Level) */}
                                        <div className="relative group overflow-hidden bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-white/20">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />
                                            
                                            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                                                <Target className="w-3.5 h-3.5 text-white/80" />
                                                Sector Status
                                            </h3>
                                            <div className="space-y-5 relative z-10">
                                                <MetricRow label="Active Vectors" value={counts.todo} color="text-white" />
                                                <MetricRow label="Neutralized" value={counts.done} color="text-zinc-400" />
                                                <div className="pt-5 mt-5 border-t border-white/[0.05] flex justify-between items-end relative">
                                                    <div className="space-y-1 w-full mr-4">
                                                        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Total Efficiency</span>
                                                        <div className="w-full h-1 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${counts.total > 0 ? (counts.done / counts.total) * 100 : 0}%` }}
                                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                                                className="h-full bg-gradient-to-r from-zinc-600 to-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-4xl font-serif tracking-tighter text-white">
                                                        {counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0}<span className="text-xl text-white/20 ml-0.5">%</span>
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
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${active
                ? 'bg-white/[0.10] text-white border border-white/20'
                : 'bg-transparent text-white/30 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white/60'
                }`}
        >
            {label}
        </button>
    );
}

function MetricRow({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm font-medium">{label}</span>
            <span className={`font-mono text-xl tracking-tight ${color}`}>{value}</span>
        </div>
    );
}

// Kanban Column Component
function KanbanColumn({ title, tasks, icon: Icon }: {
    title: string;
    tasks: Task[];
    icon: LucideIcon;
}) {
    return (
        <div className="relative rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.8)] hover:border-white/20 hover:scale-[1.01] overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none group-hover:from-white/[0.04] transition-colors duration-500" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay z-0" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors duration-500">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
                <div className="ml-auto flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-white/5 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-sm font-bold font-mono text-white/50 group-hover:text-white/90 transition-colors duration-500">
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
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
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
            className="transform-gpu will-change-transform w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
            <TaskCard task={task} />
        </motion.div>
    );
}
