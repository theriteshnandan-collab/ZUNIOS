
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/stores/taskStore";
import { useAuth } from "@/hooks/useAuth";
import { Battery, Zap, Target, BrainCircuit, ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppBadge } from "@/hooks/useAppBadge";

export default function MobileDashboard() {
    const { user } = useAuth();
    const { tasks, getTodoTasks } = useTaskStore();
    const activeTasks = getTodoTasks();
    const topTask = activeTasks.length > 0 ? activeTasks[0] : null; // Assume sorted by priority/date

    // Greeting Logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    // Fake Battery Level for "Mental Energy" vibe
    const [batteryLevel, setBatteryLevel] = useState(100);
    useEffect(() => {
        // Just a static vibe for now, or could map to completed tasks ratio
        setBatteryLevel(85);
    }, []);

    return (
        <div className="w-full px-4 mb-8 space-y-6 md:hidden relative z-10">

            {/* 1. TOP STATUS BAR (HUD) */}
            <div className="flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>System Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>{batteryLevel}%</span>
                    <Battery className="w-4 h-4" />
                </div>
            </div>

            {/* 2. GREETING & CONTEXT */}
            <div className="space-y-1">
                <h2 className="text-xl font-light text-white/60">{greeting},</h2>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {user?.user_metadata?.full_name?.split(' ')[0] || "Traveler"}
                </h1>
            </div>

            {/* 3. ACTIVE MISSION CARD (Glass) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <GlassCard className="p-5 border-white/10 bg-white/5 relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Current Objective
                            </span>
                            {topTask && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${topTask.priority === 'high' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                    'border-white/10 text-white/40'
                                    }`}>
                                    {topTask.priority.toUpperCase()}
                                </span>
                            )}
                        </div>

                        {topTask ? (
                            <Link href="/tasks">
                                <h3 className="text-lg font-medium text-white leading-snug mb-2 line-clamp-2">
                                    {topTask.content}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    <span>In Progress</span>
                                    <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                                </div>
                            </Link>
                        ) : (
                            <div className="py-2">
                                <p className="text-white/40 italic">No active missions.</p>
                                <p className="text-xs text-white/20 mt-1">Logs are clear.</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </motion.div>

            {/* 4. QUICK STATS ROW */}
            <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/5">
                    <span className="text-2xl font-bold text-white">{activeTasks.length}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/30">Pending</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center gap-2 bg-white/5 border-white/5">
                    <BrainCircuit className="w-6 h-6 text-cyan-400/80" />
                    <span className="text-[10px] uppercase tracking-wider text-white/30">Neural Link</span>
                </GlassCard>
            </div>

        </div>
    );
}
