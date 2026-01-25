import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

// Simple text search - NO embedding model (it crashes the server)
export async function POST(req: Request) {
    try {
        const { query, count = 10 } = await req.json();

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
            return NextResponse.json({ results: [] });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Simple text matching using Postgres ilike
        const { data, error } = await supabase
            .from('dreams')
            .select('*')
            .or(`content.ilike.%${searchTerm}%,theme.ilike.%${searchTerm}%,mood.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false })
            .limit(count);

        if (error) {
            console.error("Search error:", error.message);
            return NextResponse.json({ results: [] });
        }

        return NextResponse.json({ results: data || [] });

    } catch (error: any) {
        console.error("Search API Error:", error?.message || error);
        return NextResponse.json({ results: [] });
    }
}
