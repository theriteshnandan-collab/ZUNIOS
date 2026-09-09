import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
        console.error("OAuth provider error:", error, error_description);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error_description || error)}`);
    }

    if (code) {
        try {
            const supabase = await createClient();
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError) {
                const forwardedHost = request.headers.get('x-forwarded-host');
                const isLocalEnv = process.env.NODE_ENV === 'development';
                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}${next}`);
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${next}`);
                } else {
                    return NextResponse.redirect(`${origin}${next}`);
                }
            } else {
                console.error("Supabase code exchange error:", exchangeError.message);
                return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`);
            }
        } catch (e: any) {
            console.error("Auth callback exception:", e);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(e.message || "Failed to exchange auth session")}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
