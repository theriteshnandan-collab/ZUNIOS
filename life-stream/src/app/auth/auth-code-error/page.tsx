"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const handleRetry = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6" />
                </div>

                <h1 className="text-2xl font-bold font-serif text-white tracking-tight mb-2">
                    Authentication Interrupted
                </h1>

                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                    {error
                        ? decodeURIComponent(error)
                        : "The authentication session could not be completed or the security link has expired."}
                </p>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left text-xs text-zinc-400 space-y-2 mb-6">
                    <p className="font-semibold text-zinc-300">Common solutions:</p>
                    <ul className="list-disc list-inside space-y-1 text-zinc-400 font-light">
                        <li>The confirmation or sign-in link may have expired</li>
                        <li>Third-party cookies or privacy shields may be blocking callback redirects</li>
                        <li>Try signing in with email & password instead of OAuth</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={handleRetry}
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

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#080808]">
                <div className="animate-pulse text-white/40">Loading status...</div>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
