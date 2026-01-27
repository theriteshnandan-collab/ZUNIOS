"use client";

import { useState, useEffect } from "react";
import { Home, BookOpen, Target } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ZuniosLogo from "@/components/ZuniosLogo";

export default function FloatingNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Only render Clerk components after hydration
    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navItems = [
        { name: "Vision", icon: Home, href: "/" },
        { name: "Journal", icon: BookOpen, href: "/journal" },
        { name: "Tasks", icon: Target, href: "/tasks" },
    ];

    return (
        <>
            {/* Desktop Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md hidden md:block">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <ZuniosLogo size="md" showText={true} />
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                        isActive
                                            ? "bg-white/10 text-white shadow-sm"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-3.5 h-3.5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Action */}
                    <div className="flex items-center gap-4">
                        {mounted ? (
                            <>
                                <SignedIn>
                                    <UserButton afterSignOutUrl="/" />
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Top Header (Logo Only) */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl h-14 flex items-center justify-between px-4 md:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <ZuniosLogo size="sm" showText={true} />
                </Link>
                <div className="flex items-center gap-2">
                    {mounted ? (
                        <>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="text-xs font-medium text-white/70 border border-white/10 rounded-full px-3 py-1">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </>
                    ) : null}
                </div>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 md:hidden safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 w-full h-full touch-target",
                                    isActive ? "text-white" : "text-white/40"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-all",
                                    isActive ? "bg-white/10" : "bg-transparent"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
