
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AuraCoreProps {
    mode?: 'focus' | 'dream' | 'chill';
}

/**
 * PROJECT AURA: The Living Core
 * Performance Note: Uses CSS transforms and opacity for 60fps on mobile.
 */
export default function AuraCore({ mode = 'focus' }: AuraCoreProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Color Logic based on mode
    const getColors = () => {
        switch (mode) {
            case 'dream': return "from-purple-500/20 via-indigo-500/10 to-transparent";
            case 'chill': return "from-teal-500/20 via-emerald-500/10 to-transparent";
            case 'focus': default: return "from-white/10 via-cyan-500/5 to-transparent";
        }
    };

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            {/* 
               PERFORMANCE OPTIMIZATION:
               1. will-change-transform: Hints browser to use GPU.
               2. backface-visibility-hidden: Prevents micro-stutter.
               3. Simple opacity fade: Cheapest animation.
            */}

            {/* Layer 1: The Core Pulse (Breathing) */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-radial ${getColors()} blur-[60px] md:blur-[100px]`}
                style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
            />

            {/* Layer 2: The Inner Ring (Rotation) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-white/5 opacity-30 dashed-border"
                style={{ willChange: "transform" }}
            />

            {/* Layer 3: The Particle Dust (Static for Perf, or minimal drift) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}
