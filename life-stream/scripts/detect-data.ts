
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function detectData() {
    console.log("🕵️ DATA DETECTIVE 🕵️");

    // 1. List ALL Tables
    const { data: tables, error } = await supabase
        .from('information_schema.tables') // This might fail with ANON key, but worth a try (often blocked)
        .select('table_name')
        .eq('table_schema', 'public');

    // If API access to info_schema is blocked (likely), we test common names manually
    if (error) {
        console.log("⚠️ Could not list tables directly (Restricted). Probing common names...");
        const suspects = [
            'tasks', 'todos', 'todo_list', 'items', 'reminders',
            'entries', 'dreams', 'journal', 'journal_entries',
            'notes', 'memos', 'goals'
        ];

        for (const name of suspects) {
            const { count, error: err } = await supabase.from(name).select('*', { count: 'exact', head: true });
            if (!err) {
                console.log(`✅ FOUND TABLE: '${name}' (Rows: ${count})`);
            }
        }
    } else {
        // If we got the list
        console.log("✅ TABLES FOUND:", tables.map(t => t.table_name));
    }

    // 2. Check 'entries' Categories
    console.log("\n📊 ANALYZING 'entries' CATEGORIES:");
    const { data: categories, error: catError } = await supabase
        .from('entries')
        .select('category');

    if (categories) {
        // Manual distinct count
        const counts: Record<string, number> = {};
        categories.forEach(row => {
            const c = row.category || 'null';
            counts[c] = (counts[c] || 0) + 1;
        });
        console.log(JSON.stringify(counts, null, 2));
    } else {
        console.log("❌ Could not read entries:", catError.message);
    }

    // 3. Check 'dreams' Categories (if it exists)
    console.log("\n📊 ANALYZING 'dreams' CATEGORIES:");
    const { data: dCats, error: dError } = await supabase
        .from('dreams')
        .select('category');

    if (dCats) {
        const counts: Record<string, number> = {};
        dCats.forEach(row => {
            const c = row.category || 'null';
            counts[c] = (counts[c] || 0) + 1;
        });
        console.log(JSON.stringify(counts, null, 2));
    } else {
        console.log("ℹ️ Dreams table access info:", dError.message);
    }

}

detectData();
