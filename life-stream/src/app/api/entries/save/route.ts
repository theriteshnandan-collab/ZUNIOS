import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/vector";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for embedding generation

export async function POST(req: Request) {
    try {
        // Authenticate User using the Server Client (cookies)
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient(); // Use the server client for Auth AND DB
        const userId = user?.id || "guest";
        console.log(`Analyzing Save Request for User: ${userId}`);

        const body = await req.json();
        const { content, theme, mood, image_url, category, interpretation } = body;

        if (!content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Generate Embedding (with timeout protection)
        let embedding = null;

        // 2. Build insert data
        const insertData: any = {
            content,
            theme,
            mood,
            image_url,
            category,
            user_id: userId,
            interpretation: Array.isArray(interpretation) ? JSON.stringify(interpretation) : interpretation,
            created_at: new Date().toISOString()
        };

        // Only add embedding if it was generated successfully
        if (embedding && Array.isArray(embedding)) {
            insertData.embedding = embedding;
        }

        // 3. Insert into DB ('entries' table) if user is authenticated with Supabase
        if (user) {
            const { data, error } = await supabase.from('entries').insert(insertData).select();
            if (!error && data && data.length > 0) {
                const savedEntry = data[0];
                return NextResponse.json({ success: true, entry: savedEntry });
            }
            console.warn("Supabase insert notice:", error?.message);
        }

        // Graceful fallback for guest/offline commander mode
        const localEntry = {
            ...insertData,
            id: crypto.randomUUID(),
            is_local: true,
        };
        return NextResponse.json({ success: true, entry: localEntry, local: true });

    } catch (error: any) {
        console.error("Save API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
    }
}
