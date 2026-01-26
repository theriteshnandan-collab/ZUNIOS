// Dream/Entry Type Definition
// Shared type for all journal entries (dreams, ideas, wins, thoughts)

export interface Dream {
    id: string;
    user_id: string;
    content: string;
    theme?: string;
    mood?: string;
    image_url?: string;
    created_at: string;
    category?: 'dream' | 'idea' | 'win' | 'thought' | 'journal';
    ai_analysis?: string;
    interpretation?: string[] | string; // Can be JSON string or array
    action_suggestion?: string;
    tags?: string[];
}
