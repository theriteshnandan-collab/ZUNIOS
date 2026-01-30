import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/vector";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ results: [] });
        }

        // 1. Generate Vector for the Query
        let queryVector;
        try {
            queryVector = await generateEmbedding(query);
        } catch (e) {
            console.error("Vector generation failed:", e);
            return NextResponse.json({ error: "Failed to vectorize query" }, { status: 500 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Call RPC Function
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: queryVector,
            match_threshold: 0.1, // Adjust as needed
            match_count: 10
        });

        if (error) {
            console.error("RPC Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ results: data || [] });

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
