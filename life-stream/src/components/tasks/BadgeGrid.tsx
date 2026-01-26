"use client";

import { motion } from 'framer-motion';
import type { TaskBadge } from '@/lib/task-gamification';

interface BadgeGridProps {
    badges: TaskBadge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
    const earnedBadges = badges.filter(b => b.earned);
    const unearnedBadges = badges.filter(b => !b.earned);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl"
        >
            <h3 className="font-semibold text-white mb-4">🏅 Badges</h3>

            {earnedBadges.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-white/50 mb-2">Earned</p>
                    <div className="flex flex-wrap gap-2">
                        {earnedBadges.map(badge => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ scale: 1.1 }}
                                className="relative group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl cursor-pointer">
                                    {badge.icon}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    <p className="text-xs font-medium text-white">{badge.name}</p>
                                    <p className="text-xs text-white/50">{badge.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {unearnedBadges.length > 0 && (
                <div>
                    <p className="text-xs text-white/50 mb-2">Locked</p>
                    <div className="flex flex-wrap gap-2">
                        {unearnedBadges.slice(0, 6).map(badge => (
                            <motion.div
                                key={badge.id}
                                className="relative group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl opacity-30 cursor-pointer grayscale">
                                    {badge.icon}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    <p className="text-xs font-medium text-white">{badge.name}</p>
                                    <p className="text-xs text-white/50">{badge.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {earnedBadges.length === 0 && (
                <p className="text-sm text-white/40 text-center py-4">
                    Complete tasks to earn badges!
                </p>
            )}
        </motion.div>
    );
}
