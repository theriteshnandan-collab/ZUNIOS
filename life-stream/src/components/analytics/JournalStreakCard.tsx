"use client";

import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap } from 'lucide-react';
import type { JournalStats } from '@/lib/journal-streaks';
import { getStreakMessage } from '@/lib/journal-streaks';
import { cn } from '@/lib/utils';

interface JournalStreakCardProps {
    stats: JournalStats;
}

export function JournalStreakCard({ stats }: JournalStreakCardProps) {
    const message = getStreakMessage(stats);
    const isAtRisk = stats.daysUntilStreakLost === 0 && stats.currentStreak > 0;

    return (
        <div className={cn(
            "relative overflow-hidden border rounded-3xl p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.9)] h-full group",
            isAtRisk
                ? "bg-white/[0.05] border-white/40 ring-1 ring-white/20"
                : "bg-black/40 border-white/10 hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
        )}>
            {/* Ambient Void Glow */}
            <div className={cn(
                "absolute top-0 right-0 p-12 blur-[60px] -z-10 group-hover:scale-110 transition-transform duration-1000 pointer-events-none",
                isAtRisk ? "bg-white/10 animate-pulse" : "bg-white/[0.02]"
            )} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />

            {/* Streak Fire Animation */}
            {stats.currentStreak > 0 && (
                <motion.div
                    className="absolute -right-4 -top-2 text-8xl opacity-[0.03] pointer-events-none grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-1000"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🔥
                </motion.div>
            )}

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={cn("p-1.5 rounded-lg border", isAtRisk ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10")}>
                        <Flame className={cn("w-4 h-4", stats.currentStreak > 0 ? (isAtRisk ? 'text-white animate-pulse' : 'text-zinc-300') : 'text-zinc-800')} />
                    </div>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Resonance</span>
                    {isAtRisk && (
                        <span className="ml-auto px-2 py-0.5 bg-white text-black text-[10px] uppercase font-bold tracking-[0.2em] rounded-full animate-pulse">
                            CRITICAL
                        </span>
                    )}
                </div>

                {/* Main Streak Display */}
                <div className="flex items-baseline gap-2 mb-2 mt-auto">
                    <motion.span
                        key={stats.currentStreak}
                        initial={{ scale: 1.2, opacity: 0, filter: "blur(4px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn("text-6xl font-bold font-serif tracking-tighter drop-shadow-2xl", isAtRisk ? "text-white" : "text-zinc-300")}
                    >
                        {stats.currentStreak}
                    </motion.span>
                    <span className="text-white/30 text-sm font-medium tracking-wide uppercase">day{stats.currentStreak !== 1 ? 's' : ''}</span>
                </div>

                {/* Message */}
                <p className="text-xs text-white/40 mb-6 font-light">{message}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.05] mt-auto">
                    <StatItem
                        icon={Trophy}
                        value={stats.longestStreak}
                        label="Peak"
                        color="white"
                    />
                    <StatItem
                        icon={Calendar}
                        value={stats.entriesThisWeek}
                        label="Cycle"
                        color="white"
                    />
                    <StatItem
                        icon={Zap}
                        value={stats.totalEntries}
                        label="Gross"
                        color="white"
                    />
                </div>
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, value, label, color }: {
    icon: any;
    value: number;
    label: string;
    color: 'cyan' | 'purple' | 'white';
}) {
    const colorMap = {
        cyan: 'text-zinc-400',
        purple: 'text-zinc-400',
        white: 'text-white'
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <Icon className={cn("w-3 h-3 text-white/20", colorMap[color])} />
                <span className="text-[10px] uppercase tracking-widest text-white/30">{label}</span>
            </div>
            <div className={cn("text-lg font-bold font-mono", colorMap[color])}>{value}</div>
        </div>
    );
}
