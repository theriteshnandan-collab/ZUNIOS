import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/embeddings";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for embedding generation

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, theme, mood, image_url, category, user_id, interpretation } = body;

        if (!content || !user_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Generate Embedding (with timeout protection)
        let embedding = null;
        try {
            console.log("Generating embedding for:", content.substring(0, 50));
            // Add timeout to embedding generation
            const embeddingPromise = generateEmbedding(content);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Embedding timeout')), 30000)
            );
            embedding = await Promise.race([embeddingPromise, timeoutPromise]);
        } catch (embeddingError: any) {
            console.warn("Embedding generation failed (continuing without):", embeddingError.message);
            // Continue without embedding - entry can still be saved
        }

        // 2. Build insert data
        const insertData: any = {
            content,
            theme,
            mood,
            image_url,
            category,
            user_id,
            interpretation,
            created_at: new Date().toISOString()
        };

        // Only add embedding if it was generated successfully
        if (embedding && Array.isArray(embedding)) {
            insertData.embedding = embedding;
        }

        // 3. Insert into DB
        const { data, error } = await supabase.from('dreams').insert(insertData).select();

        if (error) {
            console.error("Supabase Insert Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Save API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
    }
}
