import { Dream } from "@/types/dream";
import { Task } from "@/types/task";
import { TaskBadge } from "./task-gamification";
import { StreakBadge } from "./journal-streaks";

export const XP_CONFIG = {
    ENTRY_XP: 50,      // High effort, meaningful
    TASK_XP: 20,       // Medium effort
    BADGE_XP: 100,     // Achievement bonus
    STREAK_BONUS_XP: 10 // Per day of streak
};

export interface LevelInfo {
    level: number;
    title: string;
    currentXP: number;
    nextLevelXP: number;
    progress: number; // 0-100
    totalXP: number;
}

const LEVEL_TITLES = [
    "Novice",           // 1
    "Explorer",         // 2
    "Thinker",          // 3
    "Journalist",       // 4
    "Architect",        // 5
    "Visionary",        // 6
    "Strategist",       // 7
    "Sage",             // 8
    "Luminary",         // 9
    "Omniscient"        // 10+
];

export function calculateTotalXP(
    entries: Dream[],
    tasks: Task[],
    badges: (TaskBadge | StreakBadge)[]
): number {
    let xp = 0;

    // Entry XP
    xp += entries.length * XP_CONFIG.ENTRY_XP;

    // Task XP
    const completedTasks = tasks.filter(t => t.status === 'done');
    xp += completedTasks.length * XP_CONFIG.TASK_XP;

    // Badge XP
    const earnedBadges = badges.filter(b => b.earned);
    xp += earnedBadges.length * XP_CONFIG.BADGE_XP;

    return xp;
}

export function getLevelInfo(totalXP: number): LevelInfo {
    // Interactive XP Curve: Level L requires 100 * (L-1)^1.5 XP
    // Or simpler: Level * 500 linearly? No, should be exponential.
    // Lvl 1: 0
    // Lvl 2: 500
    // Lvl 3: 1500
    // ...

    // Reverse calculation approx or iterative
    let level = 1;
    let xpForNext = 500;

    // Simple iterative approach for Levels 1-100 (performant enough)
    while (true) {
        const xpNeeded = Math.floor(500 * Math.pow(level, 1.2)); // Mild exponential
        if (totalXP < xpNeeded) {
            xpForNext = xpNeeded;
            break;
        }
        totalXP -= xpNeeded;
        level++;
    }

    // Determine Title
    const titleIndex = Math.min(level - 1, LEVEL_TITLES.length - 1);
    const title = LEVEL_TITLES[titleIndex];

    // Previous level threshold (effectively 0 for current level calculation frame)
    // We already subtracted the XP for previous levels in the loop

    const progress = (totalXP / xpForNext) * 100;

    // Restore Total XP for the return object
    // (Wait, the loop modified totalXP. Let's recalculate or pass distinct)
    // Actually, in the loop `totalXP` becomes the "remainder" which IS the `currentXP` in the bar.

    return {
        level,
        title,
        currentXP: Math.floor(totalXP),
        nextLevelXP: xpForNext,
        progress: Math.min(100, Math.max(0, progress)),
        totalXP: 0 // We don't need to return the original total here usually, but if needed we can refactor.
    };
}
