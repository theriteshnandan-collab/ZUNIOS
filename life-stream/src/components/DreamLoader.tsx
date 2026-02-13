"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DreamLoader() {
    const [phase, setPhase] = useState(0);

    const phases = [
        "Listening...",
        "I hear you...",
        "Let me think about that...",
        "Drawing it out...",
        "Just a moment..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p < phases.length - 1 ? p + 1 : p));
        }, 3000);
        return () => clearInterval(interval);
    }, [phases.length]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510]/95 backdrop-blur-3xl">
            {/* Simple, Human-Centric Visual */}
            <div className="relative flex items-center justify-center p-20">
                {/* Subtle Breathing Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                />

                {/* Minimal Expansion Rings (Outward) */}
                <motion.div
                    animate={{
                        scale: [1, 2.5],
                        opacity: [0.4, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-4 h-4 border border-cyan-500/50 rounded-full"
                />
            </div>

            {/* Simple Text Phasing */}
            <div className="flex flex-col items-center">
                <motion.p
                    key={phase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-white/80 text-lg font-light tracking-wide italic"
                >
                    {phases[phase]}
                </motion.p>

                {/* Small indicator dots */}
                <div className="flex gap-2 mt-8 opacity-20">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
