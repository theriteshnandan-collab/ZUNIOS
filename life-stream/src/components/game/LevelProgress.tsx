"use client";

import { motion } from "framer-motion";
import { LevelInfo } from "@/lib/leveling";
import { Sparkles } from "lucide-react";

interface LevelProgressProps {
    levelInfo: LevelInfo;
}

export default function LevelProgress({ levelInfo }: LevelProgressProps) {
    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 p-8 bg-primary/20 blur-3xl -z-10 group-hover:bg-primary/30 transition-colors" />

            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                        Rank {levelInfo.level}
                    </h3>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-lg font-bold text-white font-serif">
                            {levelInfo.title}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/30 font-mono">
                        {levelInfo.currentXP} / {levelInfo.nextLevelXP} XP
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
            </div>

            <p className="text-[10px] text-white/20 mt-2 text-center">
                Write entries & complete tasks to ascend.
            </p>
        </div>
    );
}
