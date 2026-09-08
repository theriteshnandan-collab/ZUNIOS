"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DreamLoaderProps {
    mode?: string;
}

export default function DreamLoader({ mode }: DreamLoaderProps) {
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState(0);

    const phases = [
        "Listening...",
        "Connecting with your mind...",
        "Analyzing vectors...",
        "Visualizing your vision...",
        "Let's go conquer..."
    ];

    useEffect(() => {
        setMounted(true);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const interval = setInterval(() => {
            setPhase(p => (p < phases.length - 1 ? p + 1 : p));
        }, 2000);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = originalOverflow;
        };
    }, [phases.length]);

    if (!mounted || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080808]/95 backdrop-blur-3xl select-none">
            {/* Simple, Human-Centric Visual */}
            <div className="relative flex items-center justify-center p-20">
                {/* Subtle Breathing Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.9)]"
                />

                {/* Minimal Expansion Rings (Outward) */}
                <motion.div
                    animate={{
                        scale: [1, 3],
                        opacity: [0.5, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-5 h-5 border border-cyan-500/60 rounded-full"
                />
            </div>

            {/* Simple Text Phasing */}
            <div className="flex flex-col items-center px-6 text-center">
                <motion.p
                    key={phase}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-white/90 text-xl font-light tracking-wide italic"
                >
                    {phases[phase]}
                </motion.p>

                {/* Small indicator dots */}
                <div className="flex gap-2 mt-8 opacity-40">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
