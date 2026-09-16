"use client";

import { useState, useEffect } from "react";
import { Home, BookOpen, Target, Compass, Search } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/auth/AuthButton";
import ZuniosLogo from "@/components/ZuniosLogo";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function FloatingNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();

    // Only render components after hydration
    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navItems = [
        { name: "Vision", icon: Home, href: "/" },
        { name: "Journal", icon: BookOpen, href: "/journal" },
        { name: "Tasks", icon: Target, href: "/tasks" },
        { name: "North Star", icon: Compass, href: "/manifesto" },
    ];

    const openSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new Event("open-neural-search"));
    };

    return (
        <>
            {/* Desktop Top Detached Floating Island */}
            <header className="fixed top-4 inset-x-0 mx-auto max-w-4xl px-4 z-50 pointer-events-none hidden md:block">
                <div className="pointer-events-auto h-14 px-4 pl-5 rounded-full border border-white/10 bg-black/75 backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-between gap-4 transition-all duration-500">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <ZuniosLogo size="sm" showText={true} />
                    </Link>

                    {/* Nav Items — Precision Island Architecture */}
                    <motion.nav
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-inner h-10"
                    >
                        {navItems.map(link => {
                            const isActive = pathname === link.href;
                            const isSearch = link.name === "Search";

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={isSearch ? openSearch : undefined}
                                    className="relative group px-3 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300"
                                >
                                    <div className={cn(
                                        "relative z-10 flex items-center gap-1.5 transition-all duration-300", 
                                        isActive ? "text-white" : "text-white/50 hover:text-white"
                                    )}>
                                        <link.icon className={cn("w-4 h-4", isActive ? "stroke-[2.2px] text-white" : "text-white/60 group-hover:text-white")} />
                                        <span className={cn(
                                            "text-xs font-medium tracking-tight",
                                            isActive ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
                                        )}>
                                            {link.name}
                                        </span>
                                    </div>

                                    {/* Active Pill Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 bg-white/[0.12] rounded-full border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.2)]"
                                            transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </motion.nav>

                    {/* User Action */}
                    <div className="flex items-center gap-3">
                        {!user && mounted && (
                          <button
                            type="button"
                            onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
                            className="hidden md:flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                          >
                            <span>Get Access</span>
                            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/80 group-hover:bg-white group-hover:text-black group-hover:translate-x-0.5 transition-all duration-300">→</span>
                          </button>
                        )}
                        {mounted ? (
                            <AuthButton />
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
                        <AuthButton />
                    ) : null}
                </div>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 md:hidden safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isSearch = item.name === "Search";

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={isSearch ? openSearch : undefined}
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
