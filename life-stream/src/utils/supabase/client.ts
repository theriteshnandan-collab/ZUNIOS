import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(
        url &&
        url.startsWith("http") &&
        !url.includes("your_supabase") &&
        key &&
        !key.includes("your_supabase")
    );
}

export function createClient() {
    if (client) return client;

    const isConfigured = isSupabaseConfigured();
    const url = isConfigured
        ? process.env.NEXT_PUBLIC_SUPABASE_URL!
        : "https://placeholder-project.supabase.co";
    const key = isConfigured
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

    client = createBrowserClient(url, key);
    return client;
}
