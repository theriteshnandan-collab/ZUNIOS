"use client";

import { motion } from "framer-motion";
import { Moon, Sparkles, Stars, Lightbulb, Trophy, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";

import { EntryMode } from "@/lib/theme-config";

interface DreamLoaderProps {
    mode?: EntryMode;
}

export default function DreamLoader({ mode = 'dream' }: DreamLoaderProps) {
    const [phase, setPhase] = useState(0);

    const getIcon = () => {
        switch (mode) {
            case 'thought': return <BrainCircuit className="w-12 h-12 text-slate-400 animate-pulse" />;
            case 'idea': return <Lightbulb className="w-12 h-12 text-yellow-400 animate-pulse" />;
            case 'win': return <Trophy className="w-12 h-12 text-amber-400 animate-pulse" />;
            case 'journal': return <BrainCircuit className="w-12 h-12 text-blue-400 animate-pulse" />;
            default: return <Moon className="w-12 h-12 text-primary animate-pulse" />;
        }
    };

    const getPhases = () => {
        switch (mode) {
            case 'thought': return [
                "Organizing mental fragments...",
                "Searching neural pathways...",
                "Connecting abstract concepts...",
                "Structuring the thought...",
                "Finalizing coherence..."
            ];
            case 'idea': return [
                "Convening the Board of Directors...",
                "Analyzing Market Feasibility...",
                "Running Competitive Simulation...",
                "Calculating Unicorn Potential...",
                "Drafting Executive Summary..."
            ];
            case 'win': return [
                "Calibrating Victory Metrics...",
                "Updating High-Performance Database...",
                "Simulating Momentum Shift...",
                "Consulting the Squad...",
                "Locking in the New Standard..."
            ];
            case 'journal': return [
                "Accessing Philosophical Archives...",
                "Consulting Marcus Aurelius...",
                "Analyzing Emotional Patterns...",
                "Filtering Noise...",
                "Synthesizing Wisdom..."
            ];
            default: return [
                "Connecting to the collective unconscious...",
                "Decoding symbols and archetypes...",
                "Weaving dream visualization...",
                "Consulting the oracle...",
                "Finalizing interpretation..."
            ];
        }
    };

    const phases = getPhases();

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((p) => (p + 1) % phases.length);
        }, 3000); // Slower cycles for readability
        return () => clearInterval(interval);
    }, [mode]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            {/* Central Pulsing Orb */}
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                        rotate: 360
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/40 via-purple-500/20 to-blue-500/40 blur-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    {getIcon()}
                </div>

                {/* Orbiting particles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div className="absolute -top-4 left-1/2 w-2 h-2 bg-purple-400 rounded-full blur-[1px]" />
                </motion.div>

                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-1/2 -right-6 w-3 h-3 bg-blue-400 rounded-full blur-[2px]" />
                </motion.div>
            </div>

            {/* Text Animation */}
            <div className="mt-12 text-center space-y-2 h-16">
                <motion.p
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl font-medium text-foreground tracking-wide"
                >
                    {phases[phase]}
                </motion.p>
                <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary/50"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
