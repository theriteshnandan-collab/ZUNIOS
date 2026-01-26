"use client";

import { cn } from "@/lib/utils";

interface ZuniosLogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
    className?: string;
}

/**
 * ZUNIOS OFFICIAL LOGO (The Symmetrical Duality Mark)
 * 
 * Design Philosophy:
 * - Rotated S + Mirrored S: Represents the flow of thought and its reflection.
 * - Intersection: The meeting point of consciousness and technology.
 * - Central Circle: The "Void" (Sanskrit: शून्य - Shunya), the pure state of mind.
 * - Flat 2D: Minimalist, futuristic, and premium.
 */
export default function ZuniosLogo({ size = "md", showText = true, className }: ZuniosLogoProps) {
    const sizeMap = {
        sm: { icon: "w-6 h-6", text: "text-sm", circle: "2" },
        md: { icon: "w-8 h-8", text: "text-lg", circle: "3" },
        lg: { icon: "w-12 h-12", text: "text-2xl", circle: "4.5" },
        xl: { icon: "w-20 h-20", text: "text-4xl", circle: "8" }
    };

    const currentSize = sizeMap[size];

    return (
        <div className={cn("flex items-center gap-3 group px-1", className)}>
            {/* The SVG Mark */}
            <div className={cn(
                "relative flex items-center justify-center transition-all duration-500 ease-in-out",
                "group-hover:scale-110",
                currentSize.icon
            )}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                >
                    {/* Symmetrical Intersecting Curves (Connected/Closed Aesthetic) */}
                    <path
                        d="M25 40 C 25 15, 75 15, 75 40 C 75 55, 25 45, 25 60 C 25 85, 75 85, 75 60"
                        stroke="white"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="transition-all duration-500 group-hover:stroke-purple-400"
                    />
                    <path
                        d="M75 40 C 75 15, 25 15, 25 40 C 25 55, 75 45, 75 60 C 75 85, 25 85, 25 60"
                        stroke="white"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeOpacity="0.4"
                        className="transition-all duration-500 group-hover:stroke-indigo-400"
                    />

                    {/* The Void Center */}
                    <circle
                        cx="50"
                        cy="50"
                        r="14"
                        className="fill-white group-hover:fill-purple-400 transition-all duration-500"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="6"
                        className="fill-black"
                    />
                </svg>
            </div>

            {/* Wordmark */}
            {showText && (
                <div className="flex flex-col">
                    <span className={cn(
                        "font-sans font-bold tracking-tighter text-white",
                        "transition-all duration-300",
                        currentSize.text
                    )}>
                        ZUNIOS
                    </span>
                    <span className="text-[10px] text-white/40 font-medium tracking-[0.2em] -mt-1 uppercase">
                        The Mind OS
                    </span>
                </div>
            )}
        </div>
    );
}

// Minimal Icon for favicons/small spots
export function ZuniosIcon({ className, size = 32 }: { className?: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M20 35 C 20 15, 50 15, 50 35 C 50 55, 80 55, 80 35"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
            />
            <path
                d="M20 65 C 20 85, 50 85, 50 65 C 50 45, 80 45, 80 65"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="14" fill="white" />
            <circle cx="50" cy="50" r="6" fill="black" />
        </svg>
    );
}

