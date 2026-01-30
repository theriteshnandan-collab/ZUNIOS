
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

async function inspectDatabase() {
    console.log("🔍 INSPECTING DATABASE STATE...");

    // 1. Try to list standard tables
    const tables = ['tasks', 'todos', 'entries', 'dreams', 'journal_entries'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ Table '${table}': Access Error or Does Not Exist (${error.message})`);
        } else {
            console.log(`✅ Table '${table}': EXISTS. Row Count: ${count}`);
        }
    }

    // 2. Try an INSERT to 'entries' to see if RLS blocks it
    console.log("\n🧪 TESTING WRITE PERMISSIONS (ENTRIES)...");
    const testEntry = {
        user_id: 'test-script', // This might fail RLS if specific UUID required
        content: 'Test Write',
        created_at: new Date().toISOString()
    };

    // Note: This insert will likely fail RLS if using ANON key without auth, 
    // but the ERROR MESSAGE will tell us if it's "relation not found" or "policy violation".
    const { error: insertError } = await supabase.from('entries').insert(testEntry);
    console.log(`Result: ${insertError ? `FAILED (${insertError.message})` : "SUCCESS"}`);

}

inspectDatabase();
