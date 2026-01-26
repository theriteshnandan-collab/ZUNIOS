// AI Task Extraction - Detects actionable items from entry content
// Uses pattern matching + keyword detection (no ML required)

export interface ExtractedTask {
    content: string;
    priority: 'low' | 'medium' | 'high';
    confidence: number; // 0-1
}

// Action verb patterns that indicate a task
const ACTION_PATTERNS = [
    // Direct imperatives
    /\b(need to|have to|must|should|will|gonna|going to|want to|plan to)\s+(.{10,80})/gi,
    // Infinitive goals
    /\b(try to|attempt to|aim to|hope to|looking to)\s+(.{10,80})/gi,
    // Todo markers
    /\b(todo|to-do|to do)[:.]?\s*(.{10,80})/gi,
    // Action items
    /\b(remember to|don't forget to|make sure to)\s+(.{10,80})/gi,
    // Goals
    /\b(my goal is to|objective is to|target is to)\s+(.{10,80})/gi,
];

// High priority indicators
const HIGH_PRIORITY_KEYWORDS = [
    'urgent', 'asap', 'immediately', 'critical', 'deadline',
    'today', 'tomorrow', 'this week', 'priority', 'important'
];

// Low priority indicators  
const LOW_PRIORITY_KEYWORDS = [
    'eventually', 'someday', 'maybe', 'perhaps', 'could',
    'might', 'if possible', 'when I have time', 'no rush'
];

// Cleanup patterns
const CLEANUP_PATTERNS = [
    /^(i\s+)?(need to|have to|must|should|will|gonna|going to|want to|plan to)\s+/i,
    /^(i\s+)?(try to|attempt to|aim to|hope to|looking to)\s+/i,
    /^(remember to|don't forget to|make sure to)\s+/i,
    /[.!?,;:]+$/,
];

/**
 * Extract actionable tasks from entry content
 */
export function extractTasksFromContent(content: string): ExtractedTask[] {
    const tasks: ExtractedTask[] = [];
    const seen = new Set<string>();

    // Split into sentences for better extraction
    const sentences = content.split(/[.!?\n]+/).filter(s => s.trim().length > 10);

    for (const sentence of sentences) {
        for (const pattern of ACTION_PATTERNS) {
            const matches = sentence.matchAll(pattern);
            for (const match of matches) {
                let taskContent = match[2] || match[0];

                // Clean up the task content
                taskContent = cleanTaskContent(taskContent);

                // Skip if too short or already seen
                if (taskContent.length < 10 || seen.has(taskContent.toLowerCase())) {
                    continue;
                }

                seen.add(taskContent.toLowerCase());

                // Determine priority
                const priority = determinePriority(sentence + ' ' + taskContent);

                // Calculate confidence based on pattern strength
                const confidence = calculateConfidence(sentence, taskContent);

                if (confidence >= 0.3) {
                    tasks.push({
                        content: capitalizeFirst(taskContent),
                        priority,
                        confidence
                    });
                }
            }
        }
    }

    // Sort by confidence and limit to top 5
    return tasks
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
}

/**
 * Clean up extracted task content
 */
function cleanTaskContent(content: string): string {
    let cleaned = content.trim();

    // Remove common prefixes
    for (const pattern of CLEANUP_PATTERNS) {
        cleaned = cleaned.replace(pattern, '');
    }

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Truncate if too long
    if (cleaned.length > 80) {
        cleaned = cleaned.substring(0, 77) + '...';
    }

    return cleaned;
}

/**
 * Determine task priority based on keywords
 */
function determinePriority(text: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();

    // Check for high priority keywords
    for (const keyword of HIGH_PRIORITY_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            return 'high';
        }
    }

    // Check for low priority keywords
    for (const keyword of LOW_PRIORITY_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            return 'low';
        }
    }

    return 'medium';
}

/**
 * Calculate confidence score
 */
function calculateConfidence(sentence: string, taskContent: string): number {
    let confidence = 0.5;

    // Boost for longer, more specific tasks
    if (taskContent.length > 20) confidence += 0.1;
    if (taskContent.length > 40) confidence += 0.1;

    // Boost for action verbs
    const actionVerbs = ['call', 'email', 'send', 'create', 'build', 'write', 'finish', 'complete', 'schedule', 'book', 'register', 'sign up', 'buy', 'order'];
    for (const verb of actionVerbs) {
        if (taskContent.toLowerCase().includes(verb)) {
            confidence += 0.15;
            break;
        }
    }

    // Penalize vague language
    const vagueWords = ['something', 'stuff', 'things', 'whatever'];
    for (const word of vagueWords) {
        if (taskContent.toLowerCase().includes(word)) {
            confidence -= 0.2;
        }
    }

    return Math.max(0, Math.min(1, confidence));
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if content likely contains actionable tasks
 */
export function hasActionableContent(content: string): boolean {
    const lowerContent = content.toLowerCase();

    const actionIndicators = [
        'need to', 'have to', 'must', 'should', 'will',
        'gonna', 'going to', 'want to', 'plan to',
        'todo', 'to-do', 'remember to', 'don\'t forget'
    ];

    return actionIndicators.some(indicator => lowerContent.includes(indicator));
}
