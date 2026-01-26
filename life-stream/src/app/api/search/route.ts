import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/embeddings";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow time for embedding generation

/**
 * ZUNIOS SEMANTIC SEARCH 2.0
 * 
 * This API performs true vector similarity search.
 * It converts the search query into a vector and finds the most 
 * semantically similar thoughts in the database.
 */
export async function POST(req: Request) {
    try {
        const { query, count = 10, threshold = 0.5 } = await req.json();

        // Validate input
        if (!query || typeof query !== 'string' || query.trim().length < 2) {
            return NextResponse.json({ results: [] });
        }

        const searchTerm = query.trim();

        // Initialize Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials");
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Generate query embedding
        console.log("Generating query embedding for:", searchTerm);
        const queryVector = await generateEmbedding(searchTerm);

        if (!queryVector) {
            console.warn("Embedding generation failed, falling back to text search");
            // Fallback to simple text search if embedding fails
            const { data, error } = await supabase
                .from('dreams')
                .select('*')
                .or(`content.ilike.%${searchTerm}%,theme.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false })
                .limit(count);

            return NextResponse.json({ results: data || [], isSemantic: false });
        }

        // 2. Perform Vector Similarity Search via RPC
        // Note: This requires the 'match_dreams' function to be created in Supabase
        const { data, error } = await supabase.rpc('match_dreams', {
            query_embedding: queryVector,
            match_threshold: threshold,
            match_count: count,
        });

        if (error) {
            console.error("Vector search RPC error:", error.message);
            // Graceful fallback if RPC fails (e.g. migration not run)
            const { data: fallbackData } = await supabase
                .from('dreams')
                .select('*')
                .or(`content.ilike.%${searchTerm}%,theme.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false })
                .limit(count);

            return NextResponse.json({ results: fallbackData || [], error: "Vector search pending migration", isSemantic: false });
        }

        return NextResponse.json({ results: data || [], isSemantic: true });

    } catch (error: any) {
        console.error("Search API Error:", error?.message || error);
        return NextResponse.json({ error: "Internal server error", results: [] }, { status: 500 });
    }
}
