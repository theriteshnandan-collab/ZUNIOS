// Journal Streak System - Tracks daily journaling habits
// Calculates current and longest streaks based on entry dates

import type { Dream } from '@/types/dream';

export interface JournalStats {
    currentStreak: number;
    longestStreak: number;
    totalEntries: number;
    entriesThisWeek: number;
    entriesToday: number;
    lastEntryDate: string | null;
    streakBroken: boolean; // True if user missed yesterday
    daysUntilStreakLost: number; // 0 = needs entry today, 1 = safe for today
}

export interface StreakBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    threshold: number;
    earned: boolean;
}

// Streak badge definitions
const STREAK_BADGES = [
    { id: 'streak_3', name: 'Getting Started', description: '3-day journal streak', icon: '🔥', threshold: 3 },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day journal streak', icon: '⚡', threshold: 7 },
    { id: 'streak_14', name: 'Fortnight Focus', description: '14-day journal streak', icon: '💫', threshold: 14 },
    { id: 'streak_30', name: 'Monthly Master', description: '30-day journal streak', icon: '🌟', threshold: 30 },
    { id: 'streak_60', name: 'Dedication King', description: '60-day journal streak', icon: '👑', threshold: 60 },
    { id: 'streak_100', name: 'Century Legend', description: '100-day journal streak', icon: '💯', threshold: 100 },
];

/**
 * Calculate journal statistics from entries
 */
export function calculateJournalStats(entries: Dream[]): JournalStats {
    if (!entries || entries.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalEntries: 0,
            entriesThisWeek: 0,
            entriesToday: 0,
            lastEntryDate: null,
            streakBroken: false,
            daysUntilStreakLost: 0
        };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // Count entries today and this week
    const entriesToday = entries.filter(e => new Date(e.created_at) >= todayStart).length;
    const entriesThisWeek = entries.filter(e => new Date(e.created_at) >= weekStart).length;

    // Get unique dates with entries
    const entryDates = new Set<string>();
    entries.forEach(e => {
        const date = new Date(e.created_at);
        const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        entryDates.add(dateStr);
    });

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(entryDates, todayStart);

    // Check if streak is at risk
    const hasEntryToday = entriesToday > 0;
    const todayStr = `${todayStart.getFullYear()}-${todayStart.getMonth()}-${todayStart.getDate()}`;
    const yesterdayStr = `${yesterdayStart.getFullYear()}-${yesterdayStart.getMonth()}-${yesterdayStart.getDate()}`;
    const hadEntryYesterday = entryDates.has(yesterdayStr);

    // Determine streak status
    let streakBroken = false;
    let daysUntilStreakLost = 0;

    if (currentStreak === 0) {
        streakBroken = true;
        daysUntilStreakLost = 0;
    } else if (hasEntryToday) {
        daysUntilStreakLost = 1; // Safe, already journaled today
    } else if (hadEntryYesterday) {
        daysUntilStreakLost = 0; // Need to journal today to maintain streak
    } else {
        streakBroken = true;
        daysUntilStreakLost = 0;
    }

    // Get last entry date
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastEntryDate = sortedEntries[0]?.created_at || null;

    return {
        currentStreak,
        longestStreak,
        totalEntries: entries.length,
        entriesThisWeek,
        entriesToday,
        lastEntryDate,
        streakBroken,
        daysUntilStreakLost
    };
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(entryDates: Set<string>, today: Date): { currentStreak: number; longestStreak: number } {
    if (entryDates.size === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Convert to array and sort
    const sortedDates = Array.from(entryDates)
        .map(d => {
            const [year, month, day] = d.split('-').map(Number);
            return new Date(year, month, day);
        })
        .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

    // Calculate current streak (from today backwards)
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Check if we have an entry today or yesterday
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    // Start from today if entry exists, otherwise from yesterday
    if (entryDates.has(todayStr)) {
        checkDate = new Date(today);
    } else if (entryDates.has(yesterdayStr)) {
        checkDate = new Date(yesterday);
    } else {
        // Streak is broken
        return { currentStreak: 0, longestStreak: calculateLongestStreak(sortedDates) };
    }

    // Count backwards
    while (true) {
        const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
        if (entryDates.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    const longestStreak = Math.max(currentStreak, calculateLongestStreak(sortedDates));

    return { currentStreak, longestStreak };
}

/**
 * Calculate longest streak from sorted dates
 */
function calculateLongestStreak(sortedDates: Date[]): number {
    if (sortedDates.length === 0) return 0;
    if (sortedDates.length === 1) return 1;

    let longestStreak = 1;
    let tempStreak = 1;

    // Sort ascending for this calculation
    const ascending = [...sortedDates].sort((a, b) => a.getTime() - b.getTime());

    for (let i = 1; i < ascending.length; i++) {
        const diff = ascending[i].getTime() - ascending[i - 1].getTime();
        const dayDiff = diff / (1000 * 60 * 60 * 24);

        if (Math.abs(dayDiff - 1) < 0.1) { // Allow small float errors
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }

    return Math.max(longestStreak, tempStreak);
}

/**
 * Get earned streak badges
 */
export function getStreakBadges(stats: JournalStats): StreakBadge[] {
    return STREAK_BADGES.map(badge => ({
        ...badge,
        earned: stats.longestStreak >= badge.threshold
    }));
}

/**
 * Get motivational message based on streak
 */
export function getStreakMessage(stats: JournalStats): string {
    if (stats.currentStreak === 0) {
        return "Start your streak today! 🌱";
    } else if (stats.daysUntilStreakLost === 0) {
        return `${stats.currentStreak} day streak! Write today to keep it alive 🔥`;
    } else if (stats.currentStreak < 7) {
        return `${stats.currentStreak} day streak! Keep going 💪`;
    } else if (stats.currentStreak < 30) {
        return `${stats.currentStreak} day streak! You're on fire 🔥`;
    } else {
        return `${stats.currentStreak} day streak! Legendary! 👑`;
    }
}
