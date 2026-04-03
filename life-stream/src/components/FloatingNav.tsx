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
            {/* Desktop Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-md hidden md:block">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <ZuniosLogo size="md" showText={true} />
                    </Link>

                    {/* Nav Items — Precision Island Architecture */}
                    <motion.nav
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex items-center gap-0.5 p-1 rounded-full border border-white/20 bg-black/80 backdrop-blur-3xl shadow-lg shadow-black/40 h-11"
                    >
                        {navItems.map(link => {
                            const isActive = pathname === link.href;
                            const isSearch = link.name === "Search";

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={isSearch ? openSearch : undefined}
                                    className="relative group"
                                >
                                    <div className={cn(
                                        "relative z-10 p-2.5 rounded-full transition-all duration-300", 
                                        isActive ? "text-white bg-white/[0.08]" : "text-white/40 hover:text-white hover:bg-white/[0.04]",
                                        "active:scale-95"
                                    )}>
                                        <link.icon className={cn("w-5 h-5", isActive && "stroke-[2.2px]")} />
                                    </div>

                                    {/* Active Glow — Tighter & Subtler */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 bg-white/[0.05] blur-md rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </motion.nav>

                    {/* User Action */}
                    <div className="flex items-center gap-4">
                        {!user && mounted && (
                          <Link href="/" className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 group">
                            Get Access
                            <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-white/40">→</span>
                          </Link>
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
