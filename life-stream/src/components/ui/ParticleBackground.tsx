"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionValue, useSpring, motion, useTransform } from "framer-motion";

interface ParticleBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export const ParticleBackground = ({ className, children }: ParticleBackgroundProps) => {
    return (
        <div className={cn("relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden", className)}>
            {/* Pure Obsidian Surface */}
            <div className="absolute inset-0 bg-[#050505] pointer-events-none" />
            
            {/* Subtle Hardware Grain (Extremely faint) */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 w-full">
                {children}
            </div>

            {/* Deep Focus Vignette */}
            <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 pointer-events-none" />
        </div>
    );
};
