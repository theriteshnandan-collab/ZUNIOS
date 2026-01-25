// Task Gamification Utilities
// Calculates streaks, badges, and achievement metrics

import type { Task } from '@/types/task';

export interface TaskStats {
    totalCompleted: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    tasksToday: number;
    tasksThisWeek: number;
}

export interface TaskBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedAt?: string;
}

// Badge definitions
const BADGE_DEFINITIONS = [
    { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🎯', threshold: 1 },
    { id: 'task_five', name: 'Getting Started', description: 'Complete 5 tasks', icon: '⭐', threshold: 5 },
    { id: 'task_ten', name: 'Task Master', description: 'Complete 10 tasks', icon: '🏆', threshold: 10 },
    { id: 'task_25', name: 'Productivity Pro', description: 'Complete 25 tasks', icon: '💪', threshold: 25 },
    { id: 'task_50', name: 'Achievement Hunter', description: 'Complete 50 tasks', icon: '🔥', threshold: 50 },
    { id: 'task_100', name: 'Century Club', description: 'Complete 100 tasks', icon: '💯', threshold: 100 },
    { id: 'streak_3', name: 'Streak Starter', description: '3-day completion streak', icon: '🔗', streakThreshold: 3 },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day completion streak', icon: '⚡', streakThreshold: 7 },
    { id: 'streak_14', name: 'Fortnight Force', description: '14-day completion streak', icon: '🌟', streakThreshold: 14 },
    { id: 'streak_30', name: 'Monthly Master', description: '30-day completion streak', icon: '👑', streakThreshold: 30 },
];

/**
 * Calculate task statistics from completed tasks
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
    const completedTasks = tasks.filter(t => t.status === 'done' && t.completed_at);
    const totalTasks = tasks.length;

    // Get today and this week's completed tasks
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const tasksToday = completedTasks.filter(t =>
        new Date(t.completed_at!) >= todayStart
    ).length;

    const tasksThisWeek = completedTasks.filter(t =>
        new Date(t.completed_at!) >= weekStart
    ).length;

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(completedTasks);

    return {
        totalCompleted: completedTasks.length,
        completionRate: totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0,
        currentStreak,
        longestStreak,
        tasksToday,
        tasksThisWeek
    };
}

/**
 * Calculate completion streaks
 */
function calculateStreaks(completedTasks: Task[]): { currentStreak: number; longestStreak: number } {
    if (completedTasks.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Group by date
    const dateMap = new Map<string, boolean>();
    for (const task of completedTasks) {
        if (task.completed_at) {
            const date = new Date(task.completed_at).toDateString();
            dateMap.set(date, true);
        }
    }

    // Calculate current streak (counting backwards from today)
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (dateMap.has(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    const sortedDates = Array.from(dateMap.keys())
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const diff = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
        const dayDiff = diff / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
}

/**
 * Get earned badges based on task stats
 */
export function getEarnedBadges(stats: TaskStats): TaskBadge[] {
    return BADGE_DEFINITIONS.map(badge => {
        let earned = false;

        if (badge.threshold) {
            earned = stats.totalCompleted >= badge.threshold;
        } else if (badge.streakThreshold) {
            earned = stats.longestStreak >= badge.streakThreshold;
        }

        return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earned
        };
    });
}

/**
 * Get next badge to earn
 */
export function getNextBadge(stats: TaskStats): TaskBadge | null {
    const unearned = BADGE_DEFINITIONS
        .filter(badge => {
            if (badge.threshold) {
                return stats.totalCompleted < badge.threshold;
            } else if (badge.streakThreshold) {
                return stats.longestStreak < badge.streakThreshold;
            }
            return false;
        })
        .sort((a, b) => (a.threshold || a.streakThreshold || 0) - (b.threshold || b.streakThreshold || 0));

    if (unearned.length === 0) return null;

    const next = unearned[0];
    return {
        id: next.id,
        name: next.name,
        description: next.description,
        icon: next.icon,
        earned: false
    };
}

/**
 * Get progress towards next badge
 */
export function getBadgeProgress(stats: TaskStats): { badge: string; current: number; target: number; percentage: number } | null {
    const nextBadge = BADGE_DEFINITIONS.find(badge => {
        if (badge.threshold) {
            return stats.totalCompleted < badge.threshold;
        }
        return false;
    });

    if (!nextBadge || !nextBadge.threshold) return null;

    return {
        badge: nextBadge.name,
        current: stats.totalCompleted,
        target: nextBadge.threshold,
        percentage: (stats.totalCompleted / nextBadge.threshold) * 100
    };
}
