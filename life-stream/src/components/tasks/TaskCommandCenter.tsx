"use client";

import { useState } from 'react';
import { Send, Command, Loader2, Sparkles } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { toast } from 'sonner';

export function TaskCommandCenter() {
    const [command, setCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { addTask, toggleComplete, deleteTask, tasks } = useTaskStore();

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isProcessing) return;

        setIsProcessing(true);
        const originalCommand = command; // Keep for reference
        setCommand('Processing...'); // Feedback

        try {
            // 1. Analyze Command
            const res = await fetch('/api/analyze-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: originalCommand })
            });

            if (!res.ok) throw new Error("Command failed");
            const intent = await res.json();

            // 2. Execute Action
            if (intent.action === 'create') {
                await addTask({
                    content: intent.data.content,
                    priority: intent.data.priority || 'medium',
                    due_date: intent.data.due_date || undefined
                });
                toast.success(`Task Created: ${intent.data.content}`);
            }
            else if (intent.action === 'complete' || intent.action === 'delete') {
                // Fuzzy search content
                const query = intent.data.query.toLowerCase();
                const target = tasks.find(t => t.content.toLowerCase().includes(query) && t.status !== 'done');

                if (target) {
                    if (intent.action === 'complete') {
                        await toggleComplete(target.id);
                        toast.success(`Completed: ${target.content}`);
                    } else {
                        await deleteTask(target.id);
                        toast.error(`Deleted: ${target.content}`);
                    }
                } else {
                    toast.warning(`Could not find task matching: "${intent.data.query}"`);
                }
            } else {
                toast.info("I didn't understand that command.");
            }

            setCommand(''); // Clear input

        } catch (error) {
            console.error(error);
            toast.error("System Malfunction");
            setCommand(originalCommand); // Restore input
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-30">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full" />
            <form onSubmit={handleCommand} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    ) : (
                        <Command className="w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    )}
                </div>

                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Type a command... (e.g., 'Meeting at 2pm', 'I finished the report')"
                    className="w-full bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-black/60 transition-all font-mono text-sm"
                />

                <button
                    type="submit"
                    disabled={!command.trim() || isProcessing}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-0"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>

            <div className="flex justify-center mt-2 gap-4 text-[10px] text-white/20 font-mono uppercase tracking-widest">
                <span>Cmd+K Interface</span>
                <span>•</span>
                <span>AI Powered</span>
                <span>•</span>
                <span>Voice Ready</span>
            </div>
        </div>
    );
}
