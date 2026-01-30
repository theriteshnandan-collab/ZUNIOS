
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inspectGoals() {
    console.log("🕵️ GOALS INSPECTOR 🕵️");

    const { data: goals, error } = await supabase
        .from('goals')
        .select('*')
        .limit(10);

    if (error) {
        console.log("❌ Error reading goals:", error.message);
    } else {
        console.log("✅ GOALS TABLE DATA:", JSON.stringify(goals, null, 2));
    }
}

inspectGoals();
