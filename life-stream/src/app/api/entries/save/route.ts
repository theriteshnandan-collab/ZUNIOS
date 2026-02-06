import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/vector";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for embedding generation

export async function POST(req: Request) {
    try {
        // Authenticate User
        const { createClient } = await import("@/utils/supabase/server");
        const supabaseServer = await createClient();
        const { data: { user } } = await supabaseServer.auth.getUser();

        const body = await req.json();
        const { content, theme, mood, image_url, category, user_id: bodyUserId, interpretation } = body;

        // Trust Session ID over Body ID
        const finalUserId = user?.id || bodyUserId;

        // If no user (and no guest override logic if applicable), block
        // Assuming guest flow handles this differently or allows explicit guest ID?
        // Current code allows 'guest' or Auth user.
        // If user is logged in, force their ID. 
        if (user) {
            if (finalUserId !== user.id) {
                // unauthorized attempt to save as someone else?
                // Or just force it:
            }
        }

        // Wait, if guest, user is null.
        if (!content || !finalUserId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey); // This creates a NEW client? The imports are messy.
        // Let's reuse the import.

        // The original code used `import { createClient } from "@supabase/supabase-js";` at top.
        // I need to be careful not to break "Guest" saves if they are allowed without session.
        // Page.tsx handles guest saves by NOT calling this API? 
        // Page.tsx: "Guest save failed... failed to save locally". It saves to localStorage.
        // So this API is ONLY for authenticated users?
        // "AUTH MODE SAVE" in page.tsx calls this.

        // So yes, enforce Auth.
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user_id = user.id; // Override body

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {

            // 1. Generate Embedding (with timeout protection)
            let embedding = null;
            try {
                console.log("Generating embedding for:", content.substring(0, 50));
                // Add timeout to embedding generation
                const embeddingPromise = generateEmbedding(content);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Embedding timeout')), 5000)
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

            // 3. Insert into DB - CORRECTION: Table is 'entries', not 'dreams'
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
