import { format, subDays, isSameDay } from "date-fns";

// Mock Mood Scoring (We can refine this with AI later)
// 1-10 Scale
// EXPANDED MOOD DICTIONARY (1-10 Scale)
// 1-3: Low Energy / Negative
// 4-6: Neutral / Balanced
// 7-10: High Energy / Positive
const MOOD_SCORES: Record<string, number> = {
    // HIGH (Flow, Win, Ecstatic)
    'Excited': 9, 'Happy': 8, 'Grateful': 9, 'Proud': 9, 'Flow': 10,
    'Ecstatic': 10, 'Unstoppable': 10, 'Legendary': 10, 'Manic': 8,
    'Confident': 9, 'Optimistic': 8, 'Inspired': 9, 'Determined': 9,
    'Powerful': 9, 'Energetic': 9, 'Radiant': 9, 'Bold': 8,
    'Bullish': 9, 'Moonshot': 10, 'Beast Mode': 10,

    // MID (Calm, Balanced, Focused)
    'Calm': 6, 'Relaxed': 6, 'Peaceful': 7, 'Balanced': 6,
    'Neutral': 5, 'Okay': 5, 'Fine': 5, 'Steady': 6,
    'Focused': 7, 'Stoic': 7, 'Clear': 7, 'Stillness': 7,
    'Reflective': 6, 'Contemplative': 6, 'Mindful': 7,
    'Niche': 6,

    // LOW (Sad, Tired, Stuck)
    'Anxious': 3, 'Stressed': 2, 'Sad': 2, 'Angry': 2,
    'Fearful': 1, 'Tired': 3, 'Confused': 4, 'Bored': 4,
    'Melancholic': 3, 'Lonely': 2, 'Overwhelmed': 2,
    'Turbulence': 3, 'Stuck': 2, 'Frustrated': 2,
    'Doubtful': 3, 'Lazy': 3, 'Drained': 2,
};

// FALLBACK HEURISTICS
const POSITIVE_KEYWORDS = ['good', 'great', 'love', 'best', 'win', 'high', 'up', 'sun', 'light', 'yes'];
const NEGATIVE_KEYWORDS = ['bad', 'worst', 'hate', 'lose', 'low', 'down', 'dark', 'no', 'pain', 'hard'];

function getSmartScore(moodStr: string): number {
    if (!moodStr) return 5;

    // 1. Clean string (remove emoji, taking first word)
    const cleanMood = moodStr.replace(/[^\w\s-]/g, '').split(' ')[0].trim();
    // 2. Direct Dictionary Lookup (Case insensitive)
    const exactMatch = Object.keys(MOOD_SCORES).find(k => k.toLowerCase() === cleanMood.toLowerCase());
    if (exactMatch) return MOOD_SCORES[exactMatch];

    // 3. Fallback Heuristics
    const lower = cleanMood.toLowerCase();
    if (POSITIVE_KEYWORDS.some(w => lower.includes(w))) return 7;
    if (NEGATIVE_KEYWORDS.some(w => lower.includes(w))) return 3;

    // 4. Detailed Default (Neutral)
    return 5;
}

export interface DailyMood {
    date: string;
    score: number;
    fullDate: string;
}

export function getMoodTrends(entries: any[], days = 7): DailyMood[] {
    const trends: DailyMood[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const targetDate = subDays(today, i);
        const dayEntries = entries.filter(e => isSameDay(new Date(e.created_at), targetDate));

        // Calculate average mood for the day
        let totalScore = 0;
        let count = 0;

        dayEntries.forEach(e => {
            const score = getSmartScore(e.mood);
            totalScore += score;
            count++;
        });

        const avgScore = count > 0 ? totalScore / count : 0; // 0 for empty days

        trends.push({
            date: format(targetDate, "EEE"), // "Mon"
            score: parseFloat(avgScore.toFixed(1)),
            fullDate: targetDate.toISOString()
        });
    }

    return trends;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
}

export function getCategoryDistribution(entries: any[]): CategoryData[] {
    const counts: Record<string, number> = {
        'dream': 0,
        'idea': 0,
        'win': 0,
        'journal': 0
    };

    entries.forEach(e => {
        const cat = e.category || 'dream';
        if (counts[cat] !== undefined) {
            counts[cat]++;
        }
    });

    return [
        { name: 'Visions', value: counts['dream'], color: '#a78bfa' }, // Purple-400
        { name: 'Builds', value: counts['idea'], color: '#facc15' },   // Yellow-400
        { name: 'Logs', value: counts['win'], color: '#34d399' },      // Emerald-400
        { name: 'Thinks', value: counts['journal'], color: '#60a5fa' } // Blue-400
    ].filter(item => item.value > 0);
}
