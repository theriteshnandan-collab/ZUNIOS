"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { toast } from "sonner";
import { 
    X, 
    Mail, 
    Lock, 
    User as UserIcon, 
    Eye, 
    EyeOff, 
    Loader2, 
    Sparkles, 
    ArrowRight, 
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AuthModal({ isOpen: controlledOpen, onClose: controlledClose }: AuthModalProps) {
    const [mounted, setMounted] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const supabase = createClient();
    const isConfigured = isSupabaseConfigured();

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const closeModal = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
        if (controlledClose) {
            controlledClose();
        } else {
            setInternalOpen(false);
        }
    };

    useEffect(() => {
        setMounted(true);

        const handleOpen = () => {
            setErrorMessage(null);
            setSuccessMessage(null);
            setInternalOpen(true);
        };

        window.addEventListener("open-auth-modal", handleOpen);
        return () => {
            window.removeEventListener("open-auth-modal", handleOpen);
        };
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!isConfigured) {
            toast.error("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.");
            return;
        }

        setIsGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Google sign in error:", err);
            setErrorMessage(err.message || "Failed to initiate Google sign in");
            toast.error(err.message || "Google sign in failed");
            setIsGoogleLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!email.trim()) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        if (!isConfigured) {
            toast.error("Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL & ANON KEY.");
            return;
        }

        setIsLoading(true);

        try {
            if (mode === "magic") {
                const { error } = await supabase.auth.signInWithOtp({
                    email: email.trim(),
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                setSuccessMessage("Magic sign-in link sent! Check your email inbox to log in.");
                toast.success("Magic sign-in link sent!");
            } else if (mode === "signup") {
                if (!password || password.length < 6) {
                    throw new Error("Password must be at least 6 characters long.");
                }

                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            full_name: name.trim() || undefined,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                if (data.user && !data.session) {
                    setSuccessMessage("Account created! Check your email to confirm your account and sign in.");
                    toast.success("Account created! Please verify your email.");
                } else {
                    toast.success("Welcome to Zunios!");
                    closeModal();
                    window.location.reload();
                }
            } else {
                // Sign in with password
                if (!password) {
                    throw new Error("Please enter your password.");
                }

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

                if (error) throw error;

                toast.success("Welcome back, Commander.");
                closeModal();
                window.location.reload();
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setErrorMessage(err.message || "Authentication failed. Please check your credentials.");
            toast.error(err.message || "Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 select-none isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-white relative overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 blur-3xl rounded-full pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6 space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-zinc-300 mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Consciousness Terminal</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                                {mode === "signup" ? "Create Account" : mode === "magic" ? "Magic Sign In" : "Welcome Back"}
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-400 font-light">
                                {mode === "signup"
                                    ? "Store and sync your thoughts across all devices."
                                    : mode === "magic"
                                    ? "We'll send a password-free sign-in link to your email."
                                    : "Access your second brain and neural vault."}
                            </p>
                        </div>

                        {/* Unconfigured Warning Alert */}
                        {!isConfigured && (
                            <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-amber-300">Cloud Setup Notice</p>
                                    <p className="text-amber-200/80 text-[11px] mt-0.5 leading-relaxed">
                                        Add <code className="bg-black/40 px-1 py-0.5 rounded text-[10px]">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-black/40 px-1 py-0.5 rounded text-[10px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment to connect Supabase.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Notification */}
                        {errorMessage && (
                            <div className="mb-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2.5">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                <span className="flex-1">{errorMessage}</span>
                            </div>
                        )}

                        {/* Success Notification */}
                        {successMessage && (
                            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="flex-1 leading-relaxed">{successMessage}</span>
                            </div>
                        )}

                        {/* Google OAuth Button */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-black font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer disabled:opacity-50"
                            >
                                {isGoogleLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                                        />
                                    </svg>
                                )}
                                <span>Continue with Google</span>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">or continue with email</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Email Form */}
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {mode === "signup" && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-400 font-medium">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                                className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs text-zinc-400 font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {mode !== "magic" && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-zinc-400 font-medium">Password</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                                                className="w-full bg-white/[0.04] border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2.5 rounded-xl bg-white/[0.12] hover:bg-white/[0.20] text-white font-medium text-sm transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : (
                                        <>
                                            <span>
                                                {mode === "signup"
                                                    ? "Create Account"
                                                    : mode === "magic"
                                                    ? "Send Magic Link"
                                                    : "Sign In"}
                                            </span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Mode Switching Footer */}
                            <div className="pt-2 text-center space-y-2">
                                {mode === "signin" && (
                                    <>
                                        <p className="text-xs text-zinc-400">
                                            Don&apos;t have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMode("signup");
                                                    setErrorMessage(null);
                                                    setSuccessMessage(null);
                                                }}
                                                className="text-white hover:underline font-semibold cursor-pointer"
                                            >
                                                Create one
                                            </button>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("magic");
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-[11px] text-zinc-500 hover:text-zinc-300 block w-full cursor-pointer"
                                        >
                                            Forgot password or prefer passwordless? Use Magic Link
                                        </button>
                                    </>
                                )}

                                {mode === "signup" && (
                                    <p className="text-xs text-zinc-400">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("signin");
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-white hover:underline font-semibold cursor-pointer"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                )}

                                {mode === "magic" && (
                                    <p className="text-xs text-zinc-400">
                                        Know your password?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("signin");
                                                setErrorMessage(null);
                                                setSuccessMessage(null);
                                            }}
                                            className="text-white hover:underline font-semibold cursor-pointer"
                                        >
                                            Sign in with password
                                        </button>
                                    </p>
                                )}

                                {/* Continue as Guest option */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                    >
                                        Continue in Offline / Guest Mode →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

