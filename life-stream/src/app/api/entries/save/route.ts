import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/vector";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for embedding generation

export async function POST(req: Request) {
    try {
        // Authenticate User using the Server Client (cookies)
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient(); // Use the server client for Auth AND DB
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { content, theme, mood, image_url, category, interpretation } = body;

        // Enforce User ID from session
        const user_id = user.id;

        if (!content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Generate Embedding (with timeout protection)
        let embedding = null;
        if (process.env.OPENAI_API_KEY) { // Only try if key exists
            try {
                // console.log("Generating embedding for:", content.substring(0, 50));
                const embeddingPromise = generateEmbedding(content);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Embedding timeout')), 5000)
                );
                // @ts-ignore
                embedding = await Promise.race([embeddingPromise, timeoutPromise]);
            } catch (embeddingError: any) {
                console.warn("Embedding generation failed (continuing without):", embeddingError.message);
            }
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

        // 3. Insert into DB ('entries' table)
        const { data, error } = await supabase.from('entries').insert(insertData).select();

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
