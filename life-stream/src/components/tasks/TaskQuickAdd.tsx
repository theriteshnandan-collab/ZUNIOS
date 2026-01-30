"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Flag, Calendar } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import type { TaskPriority } from '@/types/task';
import { PRIORITY_CONFIG } from '@/types/task';

interface TaskQuickAddProps {
    onAdd?: () => void;
}

export function TaskQuickAdd({ onAdd }: TaskQuickAddProps) {
    const { addTask } = useTaskStore();
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        // Default to "Today" for visibility in calendar
        const task = await addTask({
            content: content.trim(),
            priority,
            due_date: new Date().toISOString()
        });
        setIsSubmitting(false);

        if (task) {
            setContent('');
            setPriority('medium');
            onAdd?.();
            setIsOpen(false); // Auto-vanish on success
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Floating Add Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg shadow-black/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all z-50"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <Plus className="w-6 h-6" />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-4rem)] bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                <h3 className="font-semibold text-white">Quick Add Task</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* Task Input */}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What needs to be done?"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />

                                {/* Priority Selector */}
                                <div className="flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-white/40" />
                                    <div className="flex gap-2">
                                        {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-xs font-medium
                                                    transition-all duration-200
                                                    ${priority === p
                                                        ? 'ring-2 ring-offset-2 ring-offset-gray-900'
                                                        : 'opacity-60 hover:opacity-100'
                                                    }
                                                `}
                                                style={{
                                                    backgroundColor: PRIORITY_CONFIG[p].bgColor,
                                                    color: PRIORITY_CONFIG[p].color,
                                                    '--ring-color': priority === p ? PRIORITY_CONFIG[p].color : 'transparent'
                                                } as React.CSSProperties}
                                            >
                                                {PRIORITY_CONFIG[p].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={!content.trim() || isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Task'}
                                </motion.button>
                            </form>

                            {/* Keyboard Hint */}
                            <div className="px-4 py-2 border-t border-white/5 bg-white/5">
                                <p className="text-xs text-white/40 text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Enter</kbd> to add • <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> to close
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
