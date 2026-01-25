// Entry Templates for Quick-Start Journaling
// Pre-written prompts to help users start their entries

export interface EntryTemplate {
    id: string;
    title: string;
    prompt: string;
    category: 'dream' | 'idea' | 'win' | 'thought';
    icon: string;
}

export const ENTRY_TEMPLATES: Record<string, EntryTemplate[]> = {
    dream: [
        {
            id: 'dream-recall',
            title: 'Dream Recall',
            prompt: 'Last night I dreamed about...',
            category: 'dream',
            icon: '🌙'
        },
        {
            id: 'dream-symbol',
            title: 'Recurring Symbol',
            prompt: 'I keep seeing this symbol in my dreams: ... It makes me feel...',
            category: 'dream',
            icon: '🔮'
        },
        {
            id: 'dream-vision',
            title: 'Life Vision',
            prompt: 'In 5 years, I see myself... The steps to get there are...',
            category: 'dream',
            icon: '🎯'
        },
        {
            id: 'dream-desire',
            title: 'Deepest Desire',
            prompt: 'What I really want more than anything is... because...',
            category: 'dream',
            icon: '💫'
        }
    ],
    idea: [
        {
            id: 'idea-startup',
            title: 'Startup Idea',
            prompt: 'I want to build a product that... The problem it solves is...',
            category: 'idea',
            icon: '🚀'
        },
        {
            id: 'idea-creative',
            title: 'Creative Project',
            prompt: 'I want to create a... The inspiration came from...',
            category: 'idea',
            icon: '🎨'
        },
        {
            id: 'idea-improvement',
            title: 'Life Improvement',
            prompt: 'One thing I could do to improve my... is...',
            category: 'idea',
            icon: '⬆️'
        },
        {
            id: 'idea-solution',
            title: 'Problem Solution',
            prompt: 'The problem I\'ve been facing is... A possible solution could be...',
            category: 'idea',
            icon: '💡'
        }
    ],
    win: [
        {
            id: 'win-today',
            title: 'Today\'s Win',
            prompt: 'Today I accomplished... I\'m proud because...',
            category: 'win',
            icon: '🏆'
        },
        {
            id: 'win-challenge',
            title: 'Challenge Overcome',
            prompt: 'I was struggling with... but I pushed through by...',
            category: 'win',
            icon: '💪'
        },
        {
            id: 'win-milestone',
            title: 'Milestone Reached',
            prompt: 'I finally achieved... This took me... The journey taught me...',
            category: 'win',
            icon: '🎉'
        },
        {
            id: 'win-gratitude',
            title: 'Grateful For',
            prompt: 'Three things I\'m grateful for today: 1. ... 2. ... 3. ...',
            category: 'win',
            icon: '🙏'
        }
    ],
    thought: [
        {
            id: 'thought-reflect',
            title: 'Daily Reflection',
            prompt: 'Today I learned that... Tomorrow I want to...',
            category: 'thought',
            icon: '🤔'
        },
        {
            id: 'thought-feeling',
            title: 'Current Feeling',
            prompt: 'Right now I\'m feeling... because... What I need is...',
            category: 'thought',
            icon: '💭'
        },
        {
            id: 'thought-question',
            title: 'Big Question',
            prompt: 'A question I\'ve been pondering: ... My current thinking is...',
            category: 'thought',
            icon: '❓'
        },
        {
            id: 'thought-letter',
            title: 'Letter to Self',
            prompt: 'Dear future me, ... Remember that... Love, present me.',
            category: 'thought',
            icon: '✉️'
        }
    ]
};

/**
 * Get templates for a specific category
 */
export function getTemplatesForCategory(category: string): EntryTemplate[] {
    return ENTRY_TEMPLATES[category] || [];
}

/**
 * Get all templates
 */
export function getAllTemplates(): EntryTemplate[] {
    return Object.values(ENTRY_TEMPLATES).flat();
}

/**
 * Get a random template for a category
 */
export function getRandomTemplate(category: string): EntryTemplate | null {
    const templates = ENTRY_TEMPLATES[category];
    if (!templates || templates.length === 0) return null;
    return templates[Math.floor(Math.random() * templates.length)];
}
