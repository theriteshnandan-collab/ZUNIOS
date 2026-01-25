"use client";

import { cn } from "@/lib/utils";

interface ZuniosLogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    className?: string;
}

/**
 * ZUNIOS CONSCIOUSNESS MARK
 * 
 * Design Philosophy:
 * - Rounded square: Modern app-icon aesthetic
 * - Inner Bindu (dot): The seed of consciousness (Sanskrit: बिंदु)
 * - Gradient: Purple to Indigo (cosmic void)
 * - Pulse animation: Represents living thought
 * 
 * Etymology:
 * ZU (ज्ञा - knowledge) + NI (नि - inward) + OS (operating system)
 * = "The Inner Knowledge System"
 */
export default function ZuniosLogo({ size = "md", showText = true, className }: ZuniosLogoProps) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl"
    };

    const binduSizes = {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-3 h-3"
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* The Mark */}
            <div className={cn(
                "relative rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-purple-500 to-indigo-600",
                "shadow-lg shadow-purple-500/20",
                "group-hover:shadow-purple-500/40 group-hover:scale-105",
                "transition-all duration-300 ease-out",
                sizeClasses[size]
            )}>
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />

                {/* The Bindu - Consciousness Seed */}
                <div className={cn(
                    "relative rounded-full bg-white",
                    "shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                    "animate-pulse",
                    binduSizes[size]
                )} />
            </div>

            {/* Wordmark */}
            {showText && (
                <span className={cn(
                    "font-serif font-bold tracking-wide text-white",
                    "group-hover:text-purple-300 transition-colors duration-300",
                    textSizes[size]
                )}>
                    ZUNIOS
                </span>
            )}
        </div>
    );
}

// Export a minimal icon version for favicons/small uses
export function ZuniosIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="zuniosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Rounded Square */}
            <rect
                x="2" y="2"
                width="28" height="28"
                rx="8"
                fill="url(#zuniosGradient)"
            />

            {/* Bindu */}
            <circle
                cx="16" cy="16"
                r="4"
                fill="white"
                filter="url(#glow)"
            />
        </svg>
    );
}
