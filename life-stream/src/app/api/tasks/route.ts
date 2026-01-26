import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

export const dynamic = 'force-dynamic';

// Initialize Supabase
function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

// GET: Fetch all tasks for user
export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        const guestId = userId || 'guest';

        const supabase = getSupabase();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        let query = supabase
            .from('tasks')
            .select('*')
            .eq('user_id', guestId)
            .order('created_at', { ascending: false });

        // Filter by status if provided
        if (status && ['todo', 'in_progress', 'done'].includes(status)) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Fetch tasks error:", error);
            return NextResponse.json({ tasks: [] });
        }

        return NextResponse.json({ tasks: data || [] });

    } catch (error: any) {
        console.error("GET /api/tasks error:", error);
        return NextResponse.json({ tasks: [] });
    }
}

// POST: Create new task
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const guestId = userId || 'guest';

        const body: CreateTaskInput = await req.json();

        if (!body.content || body.content.trim().length === 0) {
            return NextResponse.json(
                { error: "Task content is required" },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        const newTask = {
            user_id: guestId,
            content: body.content.trim(),
            status: 'todo',
            priority: body.priority || 'medium',
            due_date: body.due_date || null,
            source_entry_id: body.source_entry_id || null,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert(newTask)
            .select()
            .single();

        if (error) {
            console.error("Create task error:", error);
            return NextResponse.json(
                { error: "Failed to create task" },
                { status: 500 }
            );
        }

        return NextResponse.json({ task: data });

    } catch (error: any) {
        console.error("POST /api/tasks error:", error);
        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
}

// PATCH: Update task
export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        const guestId = userId || 'guest';

        const { id, ...updates }: { id: string } & UpdateTaskInput = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Task ID is required" },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        // If marking as done, set completed_at
        const updateData: Record<string, unknown> = { ...updates };
        if (updates.status === 'done') {
            updateData.completed_at = new Date().toISOString();
        } else if (updates.status) {
            // If status is changed to anything other than done, clear completed_at
            updateData.completed_at = null;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', guestId)
            .select()
            .single();

        if (error) {
            console.error("Update task error:", error);
            return NextResponse.json(
                { error: "Failed to update task" },
                { status: 500 }
            );
        }

        return NextResponse.json({ task: data });

    } catch (error: any) {
        console.error("PATCH /api/tasks error:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}

// DELETE: Remove task
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        const guestId = userId || 'guest';

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Task ID is required" },
                { status: 400 }
            );
        }

        const supabase = getSupabase();

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', guestId);

        if (error) {
            console.error("Delete task error:", error);
            return NextResponse.json(
                { error: "Failed to delete task" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("DELETE /api/tasks error:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
