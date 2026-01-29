"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, CheckCircle, ArrowLeft, ListTodo, LayoutGrid, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/stores/taskStore';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd';
import { TaskCommandCenter } from '@/components/tasks/TaskCommandCenter';
import type { Task } from '@/types/task';

import { TaskCalendar } from '@/components/tasks/TaskCalendar'; // Note: Ensure export is correct
import TaskCalendarComponent from '@/components/tasks/TaskCalendar'; // Default export import
import { Calendar as CalendarIcon } from 'lucide-react';

type ViewMode = 'list' | 'kanban' | 'calendar';

export default function TasksPage() {
    const { tasks, isLoading, fetchTasks, getTaskCount } = useTaskStore();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const counts = getTaskCount();

    // ... (filters)

    const handleCommandExecuted = (result: any) => {
        // Logic to handle the parsed command
        if (result.action === 'create') {
            const newTask: Task = {
                id: crypto.randomUUID(),
                content: result.data.content,
                completed: false,
                priority: result.data.priority || 'medium',
                date: result.data.due_date, // AI might return 'tomorrow' string, needs parsing if we want strictly dates, but for now trusting string or handling in renderer
                createdAt: new Date()
            };
            addTask(newTask); // Using addTask from the store
        }
        // TODO: Handle 'complete' and 'delete'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
                {/* ... existing header content ... */}
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
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                <ListTodo className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-purple-500/30 text-purple-400' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                <CalendarIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* AI Command Center */}
                <TaskCommandCenter />

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatsCard
                        label="Total"
                        count={counts.total}
                        icon={Target}
                        color="purple"
                        onClick={() => setFilter('all')}
                        active={filter === 'all'}
                    />
                    <StatsCard
                        label="To Do"
                        count={counts.todo}
                        icon={Target}
                        color="gray"
                        onClick={() => setFilter('todo')}
                        active={filter === 'todo'}
                    />
                    <StatsCard
                        label="In Progress"
                        count={counts.inProgress}
                        icon={Clock}
                        color="purple"
                        onClick={() => setFilter('in_progress')}
                        active={filter === 'in_progress'}
                    />
                    <StatsCard
                        label="Done"
                        count={counts.done}
                        icon={CheckCircle}
                        color="green"
                        onClick={() => setFilter('done')}
                        active={filter === 'done'}
                    />
                </div>
        </div>

            {/* Main Content */ }
    <main className="max-w-6xl mx-auto px-6 pb-24 space-y-8">
        {/* AI Command Center */}
        <TaskCommandCenter />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Task List / Kanban */}
            <div className="lg:col-span-2 space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatsCard label="Total" count={counts.total} icon={Target} color="purple" onClick={() => setFilter('all')} active={filter === 'all'} />
                    <StatsCard label="To Do" count={counts.todo} icon={Target} color="gray" onClick={() => setFilter('todo')} active={filter === 'todo'} />
                    <StatsCard label="In Progress" count={counts.inProgress} icon={Clock} color="purple" onClick={() => setFilter('in_progress')} active={filter === 'in_progress'} />
                    <StatsCard label="Done" count={counts.done} icon={CheckCircle} color="green" onClick={() => setFilter('done')} active={filter === 'done'} />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View */
                    <div className="space-y-3">
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
                                    ) : viewMode === 'calendar' ? (
                                    <TaskCalendarComponent tasks={tasks} />
                                    ) : (
                                    <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
                                        {viewMode === 'list' ? (
                                            filteredTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} />
                                            ))
                                        ) : (
                                            // Kanban Columns
                                            <>
                                                <KanbanColumn title="To Do" status="todo" tasks={tasks.filter(t => !t.completed)} />
                                                <KanbanColumn title="Done" status="done" tasks={tasks.filter(t => t.completed)} />
                                            </>
                                        )}
                                    </div>
                )}
                                </div>

                {/* Right: Calendar Sidebar */}
                            <div className="lg:col-span-1 hidden lg:block">
                                <div className="sticky top-24">
                                    <TaskCalendar />
                                </div>
                            </div>
                    </div>
    </main>
            /* Kanban View */
            <div className="grid md:grid-cols-3 gap-6">
                <KanbanColumn
                    title="To Do"
                    tasks={todoTasks}
                    color="gray"
                    icon={Target}
                />
                <KanbanColumn
                    title="In Progress"
                    tasks={inProgressTasks}
                    color="purple"
                    icon={Clock}
                />
                <KanbanColumn
                    title="Done"
                    tasks={doneTasks}
                    color="green"
                    icon={CheckCircle}
                />
            </div>
            )
}
    </main >

    {/* Quick Add FAB */ }
    < TaskQuickAdd />
        </div >
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
