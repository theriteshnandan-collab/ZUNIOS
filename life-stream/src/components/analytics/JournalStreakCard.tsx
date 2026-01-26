"use client";

import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap } from 'lucide-react';
import type { JournalStats } from '@/lib/journal-streaks';
import { getStreakMessage } from '@/lib/journal-streaks';

interface JournalStreakCardProps {
    stats: JournalStats;
}

export function JournalStreakCard({ stats }: JournalStreakCardProps) {
    const message = getStreakMessage(stats);
    const isAtRisk = stats.daysUntilStreakLost === 0 && stats.currentStreak > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative overflow-hidden p-4 rounded-2xl border
                ${isAtRisk
                    ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30'
                    : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
                }
            `}
        >
            {/* Streak Fire Animation */}
            {stats.currentStreak > 0 && (
                <motion.div
                    className="absolute -right-4 -top-4 text-6xl opacity-20"
                    animate={{
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🔥
                </motion.div>
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <Flame className={`w-5 h-5 ${stats.currentStreak > 0 ? 'text-orange-400' : 'text-white/30'}`} />
                    <span className="font-semibold text-white">Journal Streak</span>
                    {isAtRisk && (
                        <span className="px-2 py-0.5 bg-orange-500/30 text-orange-300 text-xs rounded-full animate-pulse">
                            Write today!
                        </span>
                    )}
                </div>

                {/* Main Streak Display */}
                <div className="flex items-baseline gap-2 mb-3">
                    <motion.span
                        key={stats.currentStreak}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-bold text-white"
                    >
                        {stats.currentStreak}
                    </motion.span>
                    <span className="text-white/50">day{stats.currentStreak !== 1 ? 's' : ''}</span>
                </div>

                {/* Message */}
                <p className="text-sm text-white/70 mb-4">{message}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <StatItem
                        icon={Trophy}
                        value={stats.longestStreak}
                        label="Best"
                        color="yellow"
                    />
                    <StatItem
                        icon={Calendar}
                        value={stats.entriesThisWeek}
                        label="This Week"
                        color="purple"
                    />
                    <StatItem
                        icon={Zap}
                        value={stats.totalEntries}
                        label="Total"
                        color="green"
                    />
                </div>
            </div>
        </motion.div>
    );
}

function StatItem({ icon: Icon, value, label, color }: {
    icon: any;
    value: number;
    label: string;
    color: 'yellow' | 'purple' | 'green';
}) {
    const colorMap = {
        yellow: 'text-yellow-400',
        purple: 'text-purple-400',
        green: 'text-green-400'
    };

    return (
        <div className="text-center">
            <Icon className={`w-4 h-4 mx-auto mb-1 ${colorMap[color]}`} />
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-xs text-white/40">{label}</div>
        </div>
    );
}
