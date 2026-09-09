import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
    const cookieStore = await cookies();

    const isConfigured = isSupabaseConfigured();
    const url = isConfigured
        ? process.env.NEXT_PUBLIC_SUPABASE_URL!
        : "https://placeholder-project.supabase.co";
    const key = isConfigured
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
