"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

function AuthConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const next = searchParams.get("next") || "/";

        const supabase = createClient();

        const processAuth = async () => {
            try {
                // 1. If code parameter is present, exchange for session in browser
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        throw error;
                    }
                    setStatus("success");
                    toast.success("Successfully authenticated!");
                    router.push(next);
                    return;
                }

                // 2. If token_hash and type are present (email confirmation / OTP)
                if (token_hash && type) {
                    const { error } = await supabase.auth.verifyOtp({
                        type: type as any,
                        token_hash,
                    });
                    if (error) {
                        throw error;
                    }
                    setStatus("success");
                    toast.success("Email confirmed successfully!");
                    router.push(next);
                    return;
                }

                // 3. If session already exists in client
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    setStatus("success");
                    router.push(next);
                    return;
                }

                throw new Error("No authorization code or verification token found.");
            } catch (err: any) {
                console.error("Client auth confirmation error:", err);
                setStatus("error");
                setErrorMessage(err.message || "Failed to complete authentication session.");
            }
        };

        processAuth();
    }, [searchParams, router]);

    if (status === "processing") {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
                <h2 className="text-xl font-bold font-serif text-white mb-1">Completing Authorization</h2>
                <p className="text-sm text-zinc-400 font-light">Establishing secure connection with your neural vault...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center relative overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>

                    <h1 className="text-2xl font-bold font-serif text-white tracking-tight mb-2">
                        Sign In Interrupted
                    </h1>

                    <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                        {errorMessage || "The authentication session could not be established."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => window.location.href = "/"}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Again</span>
                        </Button>

                        <Button
                            asChild
                            variant="ghost"
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                <span>Return Home</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-xl font-bold font-serif text-white mb-1">Access Granted</h2>
            <p className="text-sm text-zinc-400 font-light">Redirecting to console...</p>
        </div>
    );
}

export default function AuthConfirmPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#080808]">
                <div className="animate-pulse text-white/40">Verifying credentials...</div>
            </div>
        }>
            <AuthConfirmContent />
        </Suspense>
    );
}
