"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useMode } from "@/components/ModeProvider";
import { THEMES } from "@/lib/theme-config";

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const { mode } = useMode();
    const activeTheme = THEMES[mode];
    const activeBlobs = activeTheme.blobs;

    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Purple-tinted void color - matching entire app
    const voidColor = '#0d0a12';

    return (
        <div className="relative min-h-screen overflow-x-hidden transition-colors duration-1000" style={{ backgroundColor: voidColor }}>
            {/* Fixed Background Layer - The Void */}
            {mounted && (
                <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: voidColor }}>
                    {/* Blobs Container - No Mask, just subtle unified fade */}
                    <div className="absolute inset-0">
                        {/* Aurora Blobs - Purple Dream Aesthetic */}
                        <div className={cn(
                            "absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ease-in-out opacity-100 animate-pulse-slow",
                            activeBlobs.one
                        )} />

                        <div className={cn(
                            "absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full blur-[100px] transition-all duration-1000 ease-in-out opacity-100 animate-blob",
                            activeBlobs.three
                        )} />
                    </div>

                    {/* Noise overlay for texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />
                </div>
            )}

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
