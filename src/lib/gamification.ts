import { differenceInCalendarDays, isSameDay, subDays } from "date-fns";

export interface Badge {
    id: string;
    label: string;
    icon: string; // Lucide icon name or emoji
    description: string;
    unlockedAt?: Date;
}

export interface UserStats {
    streak: number;
    totalEntries: number;
    lastEntryDate: Date | null;
    badges: Badge[];
}

export const BADGES: Badge[] = [
    { id: 'first_step', label: 'First Step', icon: '🌱', description: 'Logged your first entry' },
    { id: 'three_day_streak', label: 'Consistency', icon: '🔥', description: 'Logged entries for 3 days in a row' },
    { id: 'week_warrior', label: 'Week Warrior', icon: '⚔️', description: 'Logged entries for 7 days in a row' },
    { id: 'dream_explorer', label: 'Dream Explorer', icon: '🌙', description: 'Logged 5+ dreams' },
    { id: 'idea_machine', label: 'Idea Machine', icon: '💡', description: 'Logged 5+ ideas' },
];

export function calculateStats(entries: any[]): UserStats {
    if (!entries || entries.length === 0) {
        return { streak: 0, totalEntries: 0, lastEntryDate: null, badges: [] };
    }

    // Sort by date descending
    const sorted = [...entries].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const today = new Date();
    const lastEntryDate = new Date(sorted[0].created_at);
    const totalEntries = entries.length;

    // Calculate Streak
    let streak = 0;
    // Check if active today or yesterday (streak alive)
    const isAlive = isSameDay(lastEntryDate, today) || isSameDay(lastEntryDate, subDays(today, 1));

    if (isAlive) {
        streak = 1;
        // Iterate backwards to count consecutive days
        // Get unique dates
        const uniqueDates = Array.from(new Set(sorted.map(e =>
            new Date(e.created_at).toDateString()
        ))).map(d => new Date(d));

        // Check consecutive days
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const current = uniqueDates[i];
            const prev = uniqueDates[i + 1];
            if (differenceInCalendarDays(current, prev) === 1) {
                streak++;
            } else {
                break;
            }
        }
    }

    // Calculate Badges
    const earnedBadges: Badge[] = [];

    if (totalEntries >= 1) earnedBadges.push(BADGES.find(b => b.id === 'first_step')!);
    if (streak >= 3) earnedBadges.push(BADGES.find(b => b.id === 'three_day_streak')!);
    if (streak >= 7) earnedBadges.push(BADGES.find(b => b.id === 'week_warrior')!);

    const dreamsCount = entries.filter(e => e.category === 'dream').length;
    if (dreamsCount >= 5) earnedBadges.push(BADGES.find(b => b.id === 'dream_explorer')!);

    const ideasCount = entries.filter(e => e.category === 'idea').length;
    if (ideasCount >= 5) earnedBadges.push(BADGES.find(b => b.id === 'idea_machine')!);

    return {
        streak,
        totalEntries,
        lastEntryDate,
        badges: earnedBadges
    };
}
