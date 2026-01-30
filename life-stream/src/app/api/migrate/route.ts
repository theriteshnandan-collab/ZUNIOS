import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (!supabase) return NextResponse.json({ error: "Database not connected" }, { status: 500 });

        // 1. Fetch old dreams
        const { data: oldDreams, error: fetchError } = await supabase
            .from('dreams')
            .select('*')
            .eq('user_id', userId);

        if (fetchError) throw fetchError;
        if (!oldDreams || oldDreams.length === 0) {
            return NextResponse.json({ message: "No legacy data found to migrate." });
        }

        // 2. Transform and Insert into entries
        const entries = oldDreams.map(dream => ({
            id: dream.id, // Keep ID to prevent duplicates if already migrated
            user_id: dream.user_id,
            content: dream.content,
            theme: dream.theme,
            mood: dream.mood,
            image_url: dream.image_url,
            category: dream.category || 'dream',
            created_at: dream.created_at,
            interpretation: dream.interpretation,
            // embedding: null // Embeddings will need to be regenerated or copied if format matches
        }));

        const { error: insertError } = await supabase
            .from('entries')
            .upsert(entries, { onConflict: 'id', ignoreDuplicates: true });

        if (insertError) throw insertError;

        return NextResponse.json({
            success: true,
            count: entries.length,
            message: `Successfully migrated ${entries.length} memories.`
        });

    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
