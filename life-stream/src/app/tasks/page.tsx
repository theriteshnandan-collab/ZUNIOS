"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, CheckCircle, ArrowLeft, ListTodo, LayoutGrid, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd';
import TaskCommandCenter from '@/components/tasks/TaskCommandCenter';
import type { Task } from '@/types/task';
import TaskCalendarComponent from '@/components/tasks/TaskCalendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'list' | 'kanban' | 'calendar';

export default function TasksPage() {
    const { tasks, isLoading, fetchTasks, getTaskCount, addTask, toggleComplete, deleteTask } = useTaskStore();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const counts = getTaskCount();

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'todo') return !task.completed;
        if (filter === 'in_progress') return !task.completed; // Logic simplification for now
        if (filter === 'done') return task.completed;
        return true;
    });

    // Kanban Buckets
    const todoTasks = tasks.filter(t => !t.completed);
    const inProgressTasks = tasks.filter(t => !t.completed && false); // Placeholder
    const doneTasks = tasks.filter(t => t.completed);

    const handleCommandExecuted = (result: any) => {
        const { action, data } = result;

        if (action === 'create') {
            const newTask: Task = {
                id: crypto.randomUUID(),
                content: data.content,
                completed: false,
                priority: data.priority || 'medium',
                date: data.date || undefined,
                createdAt: new Date()
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
                                    <Target className="w-6 h-6 text-purple-500" />
                                    Mission Control
                                </h1>
                                <p className="text-sm text-white/50">Turn thoughts into action</p>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'}`}
                            >
                                <ListTodo className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'}`}
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

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatsCard label="Total" count={counts.total} icon={Target} color="purple" onClick={() => setFilter('all')} active={filter === 'all'} />
                    <StatsCard label="To Do" count={counts.todo} icon={Target} color="gray" onClick={() => setFilter('todo')} active={filter === 'todo'} />
                    <StatsCard label="In Progress" count={counts.inProgress} icon={Clock} color="purple" onClick={() => setFilter('in_progress')} active={filter === 'in_progress'} />
                    <StatsCard label="Done" count={counts.done} icon={CheckCircle} color="green" onClick={() => setFilter('done')} active={filter === 'done'} />
                </div>

                {/* View Render */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {viewMode === 'calendar' && (
                            <TaskCalendarComponent tasks={tasks} />
                        )}

                        {viewMode === 'kanban' && (
                            <div className="grid md:grid-cols-3 gap-6">
                                <KanbanColumn title="To Do" tasks={todoTasks} color="gray" icon={Target} />
                                <KanbanColumn title="In Progress" tasks={inProgressTasks} color="purple" icon={Clock} />
                                <KanbanColumn title="Done" tasks={doneTasks} color="green" icon={CheckCircle} />
                            </div>
                        )}

                        {viewMode === 'list' && (
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {filteredTasks.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-20"
                                            >
                                                <Target className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                                <p className="text-white/50 mb-2">No tasks yet</p>
                                                <p className="text-sm text-white/30">Type a command above or click +</p>
                                            </motion.div>
                                        ) : (
                                            filteredTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} />
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="hidden lg:block relative">
                                    <div className="sticky top-24">
                                        <TaskCalendarComponent tasks={tasks} />
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

// Stats Card Component
function StatsCard({ label, count, icon: Icon, color, onClick, active }: {
    label: string;
    count: number;
    icon: LucideIcon;
    color: 'purple' | 'green' | 'gray';
    onClick: () => void;
    active: boolean;
}) {
    const colorMap = {
        purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
        green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
        gray: 'from-white/5 to-white/5 border-white/10'
    };

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                p-4 rounded-2xl bg-gradient-to-br border text-left transition-all
                ${colorMap[color]}
                ${active ? 'ring-2 ring-purple-500/50' : ''}
            `}
        >
            <Icon className={`w-5 h-5 mb-2 ${color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-white/40'}`} />
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-sm text-white/50">{label}</div>
        </motion.button>
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
