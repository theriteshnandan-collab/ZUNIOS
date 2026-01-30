
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing Database Connection...");

    // 1. Check Tasks Table
    const { data: tasks, error: taskError } = await supabase.from('tasks').select('count', { count: 'exact', head: true });

    if (taskError) {
        console.error("❌ TASKS Table Error:", taskError.message);
    } else {
        console.log("✅ TASKS Table: Connected");
    }

    // 2. Check Entries Table
    const { data: entries, error: entryError } = await supabase.from('entries').select('count', { count: 'exact', head: true });

    if (entryError) {
        console.error("❌ ENTRIES Table Error:", entryError.message);
    } else {
        console.log("✅ ENTRIES Table: Connected");
    }

    // 3. Check Vector Extension (via Tasks embedding column)
    // We can't check extension directly easily from client, but we can try to insert a dummy task with embedding if we want.
    // For now, simple select is enough to prove table exists.
}

testConnection();
