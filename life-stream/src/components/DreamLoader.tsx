"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EntryMode } from "@/lib/theme-config";

interface DreamLoaderProps {
    mode?: EntryMode;
}

export default function DreamLoader({ mode = 'dream' }: DreamLoaderProps) {
    const [phase, setPhase] = useState(0);

    const phases = [
        "Consulting Neural Core...",
        "Gleaning Insights...",
        "Visualizing Intent...",
        "Calibrating Neural Sync...",
        "Ready."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p < phases.length - 1 ? p + 1 : p));
        }, 2000);
        return () => clearInterval(interval);
    }, [phases.length]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030308]/95 backdrop-blur-3xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" style={{ animationDelay: '1s' }} />
            </div>

            {/* NEURAL IRIS (The Core) */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/5 border-t-white/20 border-l-white/10"
                />

                {/* Mid Ring (Counter Rotate) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-white/5 border-b-cyan-500/20 border-r-cyan-500/10"
                />

                {/* The "Iris" Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full shadow-[0_0_60px_rgba(6,182,212,0.5)] blur-sm"
                />

                {/* Inner Core */}
                <div className="absolute w-6 h-6 bg-white rounded-full z-10 shadow-[0_0_20px_#fff]" />

                {/* Scanning Orbitals */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute inset-0"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
                    </motion.div>
                ))}
            </div>

            {/* Text Phase Interface */}
            <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center">
                    <motion.p
                        key={phase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-xl font-light tracking-[0.2em] uppercase"
                    >
                        {phases[phase]}
                    </motion.p>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-4" />
                </div>

                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: phase >= i ? 1 : 0.2,
                                scale: phase === i ? 1.2 : 1
                            }}
                            transition={{ duration: 0.5 }}
                            className={`w-1.5 h-1.5 rounded-full ${phase >= i ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Status (Minimal) */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-12">
                <div className="flex flex-col items-center opacity-30">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Neural Load</span>
                    <span className="text-xs text-white font-mono">42.8%</span>
                </div>
                <div className="flex flex-col items-center opacity-30">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Latency</span>
                    <span className="text-xs text-white font-mono">14ms</span>
                </div>
                <div className="flex flex-col items-center opacity-30">
                    <span className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Link</span>
                    <span className="text-xs text-white font-mono text-cyan-400">Stable</span>
                </div>
            </div>
        </div>
    );
}
