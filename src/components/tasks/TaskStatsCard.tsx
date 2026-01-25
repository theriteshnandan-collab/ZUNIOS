"use client";

import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Zap } from 'lucide-react';
import type { TaskStats } from '@/lib/task-gamification';

interface TaskStatsCardProps {
    stats: TaskStats;
}

export function TaskStatsCard({ stats }: TaskStatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl"
        >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Your Progress
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Streak */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Flame className={`w-5 h-5 ${stats.currentStreak > 0 ? 'text-orange-400' : 'text-white/30'}`} />
                        <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
                    </div>
                    <p className="text-xs text-white/50">Day Streak</p>
                </div>

                {/* Today */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className={`w-5 h-5 ${stats.tasksToday > 0 ? 'text-green-400' : 'text-white/30'}`} />
                        <span className="text-2xl font-bold text-white">{stats.tasksToday}</span>
                    </div>
                    <p className="text-xs text-white/50">Done Today</p>
                </div>

                {/* Completion Rate */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className={`w-5 h-5 ${stats.completionRate > 50 ? 'text-purple-400' : 'text-white/30'}`} />
                        <span className="text-2xl font-bold text-white">{Math.round(stats.completionRate)}%</span>
                    </div>
                    <p className="text-xs text-white/50">Completion</p>
                </div>

                {/* Total */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Trophy className={`w-5 h-5 ${stats.totalCompleted > 0 ? 'text-yellow-400' : 'text-white/30'}`} />
                        <span className="text-2xl font-bold text-white">{stats.totalCompleted}</span>
                    </div>
                    <p className="text-xs text-white/50">Total Done</p>
                </div>
            </div>
        </motion.div>
    );
}
