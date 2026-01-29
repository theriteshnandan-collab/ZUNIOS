"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Clock, Trash2, Flag } from 'lucide-react';
import type { Task } from '@/types/task';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/types/task';
import { useTaskStore } from '@/stores/taskStore';

interface TaskCardProps {
    task: Task;
    onComplete?: () => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
    const { updateTask, deleteTask, toggleComplete } = useTaskStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const priorityConfig = PRIORITY_CONFIG[task.priority];
    const isDone = task.status === 'done';

    const handleToggleComplete = async () => {
        setIsCompleting(true);
        if (!isDone) {
            import('@/lib/confetti').then(mod => mod.celebrateTaskComplete());
        }
        await toggleComplete(task.id);
        setIsCompleting(false);
        onComplete?.();
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteTask(task.id);
    };

    const handleStatusCycle = async () => {
        const statusOrder: Task['status'][] = ['todo', 'done'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % 2];
        await updateTask(task.id, { status: nextStatus });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className={`
                relative p-4 rounded-xl border backdrop-blur-sm
                transition-all duration-200 cursor-pointer group
                ${isDone
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Priority Indicator */}
            <div
                className="absolute top-0 left-4 w-8 h-1 rounded-b-full"
                style={{ backgroundColor: priorityConfig.color }}
            />

            <div className="flex items-start gap-3">
                {/* Checkbox - Expanded Touch Target */}
                <motion.button
                    onClick={handleToggleComplete}
                    whileTap={{ scale: 0.9 }}
                    className={`
                        mt-0.5 p-2 -ml-2 rounded-full flex items-center justify-center
                        transition-colors hover:bg-white/5
                    `}
                >
                    <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200
                        ${isDone
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/30 group-hover:border-purple-500'
                        }
                    `}>
                        <AnimatePresence>
                            {isDone && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Check className="w-3 h-3 text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.button>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                    <p className={`
                        text-sm font-medium transition-all duration-200 leading-snug
                        ${isDone ? 'text-white/50 line-through' : 'text-white'}
                    `}>
                        {task.content}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Status badge */}
                        <button
                            onClick={handleStatusCycle}
                            className={`
                                flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider
                                transition-colors hover:opacity-80
                            `}
                            style={{
                                backgroundColor: `${STATUS_CONFIG[task.status].color}20`,
                                color: STATUS_CONFIG[task.status].color
                            }}
                        >
                            {task.status === 'todo' && <Circle className="w-3 h-3" />}
                            {task.status === 'done' && <Check className="w-3 h-3" />}
                            <span>{STATUS_CONFIG[task.status].label}</span>
                        </button>

                        {/* Due date */}
                        {task.due_date && (
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                                <span>📅</span>
                                {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delete button - Always visible on mobile, hover on desktop */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleDelete}
                    className="p-2 -mr-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors md:opacity-0 md:group-hover:opacity-100"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
