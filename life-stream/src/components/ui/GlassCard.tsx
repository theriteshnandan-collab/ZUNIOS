"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    /** Enables the "Inner Light" 1px top edge highlight */
    innerLight?: boolean;
    /** Intensity of the noise overlay (0-1) */
    noiseOpacity?: number;
}

/**
 * GlassCard (Titan System)
 * 
 * A "Scrubbed Glass" card with:
 * - Blur backdrop
 * - Noise texture overlay
 * - Inner light edge (top highlight)
 * - No solid borders (light simulation only)
 */
export function GlassCard({
    children,
    className = "",
    innerLight = true,
    noiseOpacity = 0.04
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-white/[0.03] backdrop-blur-xl",
                innerLight && "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
                "transition-all duration-300",
                "hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
                className
            )}
        >
            {/* Noise Texture Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    opacity: noiseOpacity
                }}
            />
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
