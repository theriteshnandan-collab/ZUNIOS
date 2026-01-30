/**
 * 🧠 LOCAL INTELLIGENCE (Offline Fallback)
 * When the Cloud API fails (Rate Limit / Offline), this module takes over.
 * It uses pure client-side logic (Regex) to parse commands.
 */

interface LocalParseResult {
    action: 'create';
    data: {
        content: string;
        priority: 'low' | 'medium' | 'high';
        due_date?: string;
    }
}

export function parseCommandLocally(text: string): LocalParseResult {
    let content = text;
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let due_date: string | undefined;

    // 1. Detect Priority
    if (/\b(?:urgent|priority|high|p1|important)\b/i.test(text)) {
        priority = 'high';
        content = content.replace(/\b(?:urgent|priority|high|p1|important)\b/gi, '').trim();
    } else if (/\b(?:low|minor|p3)\b/i.test(text)) {
        priority = 'low';
        content = content.replace(/\b(?:low|minor|p3)\b/gi, '').trim();
    }

    // 2. Detect Due Date (Simple Heuristics)
    const today = new Date();
    if (/\b(?:tomorrow|tmrw)\b/i.test(text)) {
        const tmrw = new Date(today);
        tmrw.setDate(tmrw.getDate() + 1);
        due_date = tmrw.toISOString();
        content = content.replace(/\b(?:tomorrow|tmrw)\b/gi, '').trim();
    } else if (/\b(?:tonight)\b/i.test(text)) {
        const tonight = new Date(today);
        tonight.setHours(21, 0, 0, 0);
        due_date = tonight.toISOString();
        content = content.replace(/\b(?:tonight)\b/gi, '').trim();
    }

    // 3. Clean up generic command words
    // "Add task to buy milk" -> "buy milk"
    content = content.replace(/^\s*(?:add|create|new|plus|log|remind\s+me\s+to|i\s+need\s+to)\s+(?:task|todo|mission|entry)?\s*/i, '');

    // Remove trailing punctuation
    content = content.replace(/[.:!]+$/, '');

    return {
        action: 'create',
        data: {
            content: content.trim() || "New Task", // Fallback if empty
            priority,
            due_date
        }
    };
}
