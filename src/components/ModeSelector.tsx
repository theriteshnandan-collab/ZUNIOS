"use client";

import { cn } from "@/lib/utils";
import { Eye, Zap, Target, Brain } from "lucide-react";
import { motion } from "framer-motion";

import { EntryMode, THEMES, MODE_LABELS } from "@/lib/theme-config";

interface ModeSelectorProps {
    currentMode: EntryMode;
    onModeChange: (mode: EntryMode) => void;
}

// Using new icons to match new labels
const MODES = [
    { id: 'dream', icon: Eye, color: THEMES.dream.icon, bg: THEMES.dream.blobs.one },      // Vision
    { id: 'idea', icon: Zap, color: THEMES.idea.icon, bg: THEMES.idea.blobs.one },         // Build
    { id: 'win', icon: Target, color: THEMES.win.icon, bg: THEMES.win.blobs.one },         // Log
    { id: 'journal', icon: Brain, color: THEMES.journal.icon, bg: THEMES.journal.blobs.one }, // Think
] as const;

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 p-1 bg-white/5 rounded-full border border-white/5 w-fit mx-auto">
            {MODES.map((mode) => {
                const isActive = currentMode === mode.id;
                const label = MODE_LABELS[mode.id];

                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id as EntryMode)}
                        className={cn(
                            "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
                            isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                        title={label.tagline}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeMode"
                                className={cn("absolute inset-0 rounded-full", mode.bg)}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <mode.icon className={cn("w-4 h-4 z-10", isActive ? mode.color : "")} />
                        <span className="text-sm font-medium z-10">{label.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
