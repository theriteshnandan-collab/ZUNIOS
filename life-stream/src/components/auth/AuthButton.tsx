"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/auth/AuthModal";

export function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (isMounted) {
                    setUser(user);
                }
            } catch (e) {
                console.error("Auth check failed", e);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            toast.success("Signed out successfully.");
            window.location.reload();
        } catch (error: any) {
            console.error("Sign out error:", error);
            toast.error(error.message || "Failed to sign out");
        }
    };

    if (loading) {
        return (
            <div className="h-9 w-9 rounded-full bg-white/5 animate-pulse" />
        );
    }

    return (
        <>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {!user ? (
                <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium text-xs px-4 py-1.5 rounded-full border border-white/10"
                >
                    Sign In
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-white/15 p-0 hover:border-white/30 transition-all cursor-pointer">
                            {user.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt={user.email || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-white/10 text-white font-medium text-xs">
                                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[#0f0f12] border border-white/10 text-white rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal px-3 py-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold leading-none text-white">{user.user_metadata?.full_name || "Conscious Mind"}</p>
                                <p className="text-xs leading-none text-white/50 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10 my-1" />
                        
                        <DropdownMenuItem asChild>
                            <Link href="/journal" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Consciousness Journal</span>
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                            <Link href="/tasks" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
                                <Target className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Task Operations</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-white/10 my-1" />

                        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
}
