"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, Plus, Loader2 } from 'lucide-react';
import { extractTasksFromContent, ExtractedTask } from '@/lib/task-extractor';
import { useTaskStore } from '@/stores/taskStore';

interface TaskExtractorProps {
    entryContent: string;
    entryId?: string;
    onClose?: () => void;
}

export function TaskExtractor({ entryContent, entryId, onClose }: TaskExtractorProps) {
    const { addTask } = useTaskStore();
    const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
    const [isExtracting, setIsExtracting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleExtract = async () => {
        setIsExtracting(true);

        // Simulate slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const tasks = extractTasksFromContent(entryContent);
        setExtractedTasks(tasks);
        setSelectedTasks(new Set(tasks.map((_, i) => i))); // Select all by default
        setShowResults(true);
        setIsExtracting(false);
    };

    const toggleTask = (index: number) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedTasks(newSelected);
    };

    const handleAddTasks = async () => {
        setIsAdding(true);

        const tasksToAdd = extractedTasks.filter((_, i) => selectedTasks.has(i));

        for (const task of tasksToAdd) {
            await addTask({
                content: task.content,
                priority: task.priority,
                source_entry_id: entryId
            });
        }

        setIsAdding(false);
        onClose?.();
    };

    if (!showResults) {
        return (
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleExtract}
                disabled={isExtracting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
            >
                {isExtracting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
                {isExtracting ? 'Extracting...' : 'Extract Tasks'}
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl"
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Detected Tasks
                </h4>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {extractedTasks.length === 0 ? (
                <p className="text-white/50 text-sm py-4 text-center">
                    No actionable tasks detected in this entry.
                </p>
            ) : (
                <>
                    <div className="space-y-2 mb-4">
                        <AnimatePresence>
                            {extractedTasks.map((task, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => toggleTask(index)}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl cursor-pointer
                                        transition-all duration-200
                                        ${selectedTasks.has(index)
                                            ? 'bg-purple-500/20 border border-purple-500/30'
                                            : 'bg-white/5 border border-transparent hover:border-white/10'
                                        }
                                    `}
                                >
                                    {/* Checkbox */}
                                    <div className={`
                                        w-5 h-5 rounded-md border-2 flex items-center justify-center
                                        transition-all duration-200
                                        ${selectedTasks.has(index)
                                            ? 'bg-purple-500 border-purple-500'
                                            : 'border-white/30'
                                        }
                                    `}>
                                        {selectedTasks.has(index) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>

                                    {/* Task content */}
                                    <div className="flex-1">
                                        <p className="text-sm text-white">{task.content}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`
                                                text-xs px-2 py-0.5 rounded-full
                                                ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }
                                            `}>
                                                {task.priority}
                                            </span>
                                            <span className="text-xs text-white/30">
                                                {Math.round(task.confidence * 100)}% confidence
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">
                            {selectedTasks.size} of {extractedTasks.length} selected
                        </span>
                        <motion.button
                            onClick={handleAddTasks}
                            disabled={selectedTasks.size === 0 || isAdding}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAdding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {isAdding ? 'Adding...' : 'Add to Tasks'}
                        </motion.button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
