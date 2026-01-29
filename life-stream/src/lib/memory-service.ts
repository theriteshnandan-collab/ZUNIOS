import { supabase } from '@/lib/supabase';

export interface Memory {
    id: string;
    content: string;
    similarity: number;
    created_at: string;
    mood?: string;
}

export const memoryService = {
    /**
     * Recall related memories based on a text query.
     * Uses the 'match_dreams' RPC function in Supabase.
     */
    async recall(query: string, limit = 3): Promise<Memory[]> {
        try {
            // 1. Generate embedding for the query
            // We need to call an API to generate the embedding because 
            // the transformer model runs on the server (or we can run it client-side if updated).
            // For now, let's assume we have an endpoint for simple embedding generation OR
            // we use the local pipeline if valid.

            // OPTION: Call a new API endpoint /api/memory/recall
            const response = await fetch('/api/memory/recall', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, limit })
            });

            if (!response.ok) throw new Error('Recall failed');

            const data = await response.json();
            return data.memories;

        } catch (error) {
            console.error("Memory Recall Error:", error);
            return [];
        }
    }
};
