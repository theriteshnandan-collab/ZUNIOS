"use client";

import { motion } from "framer-motion";
import { LevelInfo } from "@/lib/leveling";
import { Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
    levelInfo: LevelInfo;
}

export default function LevelProgress({ levelInfo }: LevelProgressProps) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20 h-full group">
            {/* Ambient Void Glow */}
            <div className="absolute top-0 right-0 p-12 bg-purple-500/20 blur-[50px] -z-10 group-hover:bg-purple-500/30 transition-colors duration-700 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />

            <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-yellow-500/80" />
                        Rank {levelInfo.level}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-yellow-400/90 transition-colors duration-500 font-serif">
                            {levelInfo.title}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-white/50 font-mono tracking-wider">
                        <span className="text-white font-medium">{levelInfo.currentXP}</span> / {levelInfo.nextLevelXP} XP
                    </p>
                </div>
            </div>

            {/* Cinematic Progress Bar */}
            <div className="relative z-10 w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/[0.05] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mt-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="relative h-full bg-gradient-to-r from-yellow-500/50 via-purple-500 to-purple-400 rounded-full"
                >
                    {/* Inner highlight for 3D bar effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                    {/* Glowing head of the bar */}
                    <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px] rounded-full" />
                </motion.div>
            </div>

            <p className="relative z-10 text-[10px] uppercase tracking-[0.05em] text-white/30 mt-5 transition-colors group-hover:text-white/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-white/20 group-hover:text-yellow-400/50 transition-colors" />
                Write entries & complete tasks to ascend
            </p>
        </div>
    );
}
