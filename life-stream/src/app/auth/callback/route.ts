import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/';
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    const redirectBase = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

    if (error) {
        console.error("Auth provider error:", error, error_description);
        return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(error_description || error)}`);
    }

    // 1. Handle Email OTP / Confirmation Token Hash
    if (token_hash && type) {
        try {
            const supabase = await createClient();
            const { error: verifyError } = await supabase.auth.verifyOtp({
                type,
                token_hash,
            });
            if (!verifyError) {
                return NextResponse.redirect(`${redirectBase}${next}`);
            }
            console.error("Supabase verifyOtp error:", verifyError.message);
            return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(verifyError.message)}`);
        } catch (e: any) {
            console.error("Auth callback OTP exception:", e);
            return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(e.message || "Failed to verify email token")}`);
        }
    }

    // 2. Handle PKCE OAuth / Code exchange
    if (code) {
        try {
            const supabase = await createClient();
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError) {
                return NextResponse.redirect(`${redirectBase}${next}`);
            } else {
                console.error("Supabase code exchange error:", exchangeError.message);
                return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`);
            }
        } catch (e: any) {
            console.error("Auth callback exception:", e);
            return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent(e.message || "Failed to exchange auth session")}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${redirectBase}/auth/auth-code-error`);
}
