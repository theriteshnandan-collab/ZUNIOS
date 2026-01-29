import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { createClient } from '@supabase/supabase-js';

// Create a private supabase client for RPC calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Or Service Role if RLS enforces it
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const { query, limit = 3 } = await req.json();

        if (!query) return NextResponse.json({ memories: [] });

        // 1. Generate Vector
        const embedding = await generateEmbedding(query);

        if (!embedding) {
            return NextResponse.json({ error: "Failed to vectorize query" }, { status: 500 });
        }

        // 2. Search Vector Database
        const { data: memories, error } = await supabase.rpc('match_dreams', {
            query_embedding: embedding,
            match_threshold: 0.5, // 50% similarity threshold
            match_count: limit
        });

        if (error) {
            console.error("Supabase RPC Error:", error);
            throw error;
        }

        return NextResponse.json({ memories: memories || [] });

    } catch (error: any) {
        console.error("Memory API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
