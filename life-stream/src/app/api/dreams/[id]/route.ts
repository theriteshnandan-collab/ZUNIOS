import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabase } from '@/lib/supabase'; // Using admin client for data ops, but verifying auth first

// DELETE /api/dreams/[id] - Delete a dream
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a promise in Next.js 15
) {
    try {
        const resolvedParams = await params; // Await params first
        const supabaseServer = await createClient();
        const { data: { user } } = await supabaseServer.auth.getUser();
        const userId = user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!supabase) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 500 }
            );
        }

        const { id: dreamId } = await params;

        // Delete the dream (only if it belongs to the user)
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('id', dreamId)
            .eq('user_id', userId);

        if (error) {
            console.error("Delete error:", error);
            return NextResponse.json(
                { error: "Failed to delete dream" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Delete Dream Error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
