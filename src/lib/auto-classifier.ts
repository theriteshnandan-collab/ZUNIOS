import { EntryMode } from "./theme-config";

/**
 * ENHANCED AUTO-CLASSIFIER v2.0
 * 
 * Technique: Weighted Keyword Scoring
 * 
 * Instead of first-match-wins, this system:
 * 1. Scans ALL keywords for ALL categories
 * 2. Assigns weights (stronger indicators = higher weight)
 * 3. Tallies scores per category
 * 4. Returns the category with the highest score
 * 
 * Benefits:
 * - "I dreamed about launching a startup" → Scores for both Dream + Idea, picks highest
 * - More nuanced detection
 * - Handles mixed-intent inputs
 */

// KEYWORD DICTIONARIES with weights
// Higher weight = stronger indicator of that mode

const DREAM_KEYWORDS: Record<string, number> = {
    // Strong indicators (weight: 3)
    'dream': 3, 'dreamed': 3, 'dreaming': 3, 'nightmare': 3, 'lucid': 3,
    'slept': 2, 'sleeping': 2, 'woke': 2, 'waking': 2, 'asleep': 2,

    // Medium indicators (weight: 2)
    'night': 1, 'bed': 1, 'pillow': 1, 'rem': 2, 'subconscious': 2,
    'vision': 1, 'hallucination': 2, 'fantasy': 1,

    // Context clues (weight: 1)
    'floating': 1, 'flying': 1, 'falling': 1, 'chased': 1, 'strange': 1,
    'surreal': 2, 'bizarre': 1, 'weird': 1, 'vivid': 2, 'recurring': 2,
};

const WIN_KEYWORDS: Record<string, number> = {
    // Strong indicators (weight: 3)
    'won': 3, 'win': 3, 'victory': 3, 'success': 3, 'achieved': 3,
    'completed': 3, 'finished': 3, 'accomplished': 3, 'milestone': 3,

    // Medium indicators (weight: 2)
    'shipped': 2, 'launched': 2, 'deployed': 2, 'released': 2, 'published': 2,
    'proud': 2, 'celebration': 2, 'breakthrough': 2, 'nailed': 2,
    'crushed': 2, 'killed it': 2, 'smashed': 2, 'conquered': 2,

    // Context clues (weight: 1)
    'finally': 1, 'done': 1, 'closed': 1, 'signed': 1, 'accepted': 1,
    'promoted': 2, 'hired': 2, 'passed': 1, 'graduated': 2, 'certified': 2,
    'first': 1, 'record': 1, 'best': 1, 'exceeded': 2, 'beat': 1,
};

const IDEA_KEYWORDS: Record<string, number> = {
    // Strong indicators (weight: 3)
    'idea': 3, 'startup': 3, 'business': 2, 'app': 2, 'saas': 3,
    'product': 2, 'feature': 2, 'invention': 3, 'concept': 2,

    // Medium indicators (weight: 2)
    'build': 2, 'create': 2, 'develop': 2, 'design': 1, 'prototype': 2,
    'launch': 1, 'monetize': 2, 'revenue': 2, 'market': 1, 'customers': 2,
    'pitch': 2, 'investor': 2, 'funding': 2, 'valuation': 2,

    // Action verbs (weight: 1)
    'what if': 2, 'imagine': 1, 'could': 1, 'should': 1, 'might': 1,
    'maybe': 1, 'brainstorm': 2, 'pivot': 2, 'scale': 1, 'automate': 1,
    'disrupt': 2, 'innovate': 2, 'solve': 1, 'problem': 1, 'solution': 1,
};

const JOURNAL_KEYWORDS: Record<string, number> = {
    // Strong indicators (weight: 3)
    'feel': 2, 'feeling': 2, 'felt': 2, 'emotion': 2, 'mood': 2,
    'anxious': 3, 'stressed': 3, 'overwhelmed': 3, 'depressed': 3,
    'happy': 2, 'sad': 2, 'angry': 2, 'frustrated': 2, 'grateful': 2,

    // Medium indicators (weight: 2)
    'today': 1, 'yesterday': 1, 'morning': 1, 'evening': 1,
    'thinking': 2, 'wondering': 2, 'reflecting': 2, 'processing': 2,
    'need': 1, 'want': 1, 'wish': 1, 'hope': 1, 'worry': 2,

    // Context clues (weight: 1)
    'tired': 1, 'exhausted': 1, 'energized': 1, 'motivated': 1,
    'confused': 1, 'clarity': 1, 'peace': 1, 'chaos': 1,
    'relationship': 1, 'family': 1, 'friend': 1, 'work': 1, 'life': 1,
};

/**
 * Calculate score for a specific category
 */
function calculateScore(text: string, keywords: Record<string, number>): number {
    const lower = text.toLowerCase();
    let score = 0;

    for (const [keyword, weight] of Object.entries(keywords)) {
        // Use word boundary regex for accurate matching
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lower.match(regex);
        if (matches) {
            score += weight * matches.length; // Multiple occurrences increase score
        }
    }

    return score;
}

/**
 * Main prediction function with weighted scoring
 */
export function predictMode(text: string): EntryMode {
    if (!text || text.trim().length < 3) return 'thought'; // Default for empty/short input

    const scores = {
        dream: calculateScore(text, DREAM_KEYWORDS),
        win: calculateScore(text, WIN_KEYWORDS),
        idea: calculateScore(text, IDEA_KEYWORDS),
        journal: calculateScore(text, JOURNAL_KEYWORDS),
    };

    // Find the category with the highest score
    let maxScore = 0;
    let predictedMode: EntryMode = 'thought'; // Default

    for (const [mode, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            predictedMode = mode as EntryMode;
        }
    }

    // If journal wins, return 'thought' (KOGITO mode)
    if (predictedMode === 'journal') {
        return 'thought';
    }

    // Minimum threshold: require at least score of 2 to classify
    // Otherwise return default 'thought' mode
    if (maxScore < 2) {
        return 'thought';
    }

    return predictedMode;
}

/**
 * Get confidence scores for all modes (useful for UI indicators)
 */
export function getConfidenceScores(text: string): Record<string, number> {
    return {
        dream: calculateScore(text, DREAM_KEYWORDS),
        win: calculateScore(text, WIN_KEYWORDS),
        idea: calculateScore(text, IDEA_KEYWORDS),
        thought: calculateScore(text, JOURNAL_KEYWORDS),
    };
}
