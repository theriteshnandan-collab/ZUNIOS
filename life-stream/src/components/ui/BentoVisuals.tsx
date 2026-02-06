"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Brain, Activity, Zap, Shield } from "lucide-react";

// --- UTILS ---
// Safe random generator
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Reuseable Physics Card Container for Parallax
const PhysicsContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Calculate offset from center
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("relative w-full h-full overflow-hidden perspective-1000", className)}
        >
            {children}
        </motion.div>
    );
};

// --- HUD TEXT COMPONENT ---
const EliteHUD = ({ title, subtitle, icon: Icon, align = "left" }: { title: string, subtitle: string, icon: any, align?: "left" | "right" }) => (
    <div className={cn("absolute bottom-6 z-30 pointer-events-none flex flex-col gap-1", align === "right" ? "right-6 items-end text-right" : "left-6 text-left")}>
        <div className="flex items-center gap-2 mb-1">
            <div className={cn("p-1.5 rounded-lg backdrop-blur-md border border-white/10 bg-white/5", align === "right" && "order-2")}>
                <Icon className="w-4 h-4 text-white/80" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        </div>
        <p className="text-xs text-white/50 font-medium tracking-wide border-l-2 border-white/20 pl-2 uppercase">
            {subtitle}
        </p>
    </div>
);


// --- 1. NEURAL ENGINE: QUANTUM ATOM CORE ---
export const NeuralVisual = () => {
    return (
        <PhysicsContainer className="bg-[#020205] flex items-center justify-center overflow-visible">
            {/* Ambient Space Field */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020205] to-[#020205] opacity-50" />

            {/* ATOM STRUCTURE */}
            <div className="relative w-56 h-56 perspective-1000">

                {/* 1. The Nucleus (Pure Energy) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-[20px] animate-pulse-slow" />
                        <div className="absolute inset-2 bg-white rounded-full blur-md mix-blend-screen" />
                        <motion.div
                            className="absolute inset-0 border-2 border-dashed border-cyan-200/50 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Core Icon */}
                        <Brain className="w-8 h-8 text-cyan-950 fill-cyan-950 relative z-30 opacity-80" />
                    </div>
                </div>

                {/* 2. Electron Orbits (Perfect 3D Shells) */}
                {/* SHELL 1: X-Axis Orbit */}
                <motion.div
                    className="absolute inset-0 border-[1px] border-cyan-500/30 rounded-full z-10"
                    style={{ rotateX: 70 }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee] blur-[1px]" />
                </motion.div>

                {/* SHELL 2: Y-Axis Orbit */}
                <motion.div
                    className="absolute inset-2 border-[1px] border-blue-500/30 rounded-full z-10"
                    style={{ rotateY: 70 }}
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] blur-[1px]" />
                </motion.div>

                {/* SHELL 3: Diagonal Orbit */}
                <motion.div
                    className="absolute inset-4 border-[1px] border-indigo-500/30 rounded-full z-10"
                    style={{ rotateZ: 45, rotateX: 60 }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_#818cf8] blur-[1px]" />
                </motion.div>

            </div>

            <EliteHUD title="Neural Processing" subtitle="Quantum State: Stable" icon={Brain} align="right" />
        </PhysicsContainer>
    );
};

// --- 2. DAILY SYNC: 3D Equalizer ---
export const SyncVisual = () => {
    return (
        <PhysicsContainer className="bg-[#020205]">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-[#020205] to-[#020205]" />

            {/* 3D Glass Pillars */}
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-6 bg-gradient-to-b from-teal-400/80 to-emerald-600/20 rounded-md backdrop-blur-md border-t border-white/20 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                        initial={{ height: "20%" }}
                        animate={{ height: ["20%", "60%", "30%", "80%", "20%"] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1,
                            repeatType: "mirror"
                        }}
                    >
                        {/* Internal Glint */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50 blur-[1px]" />
                    </motion.div>
                ))}
            </div>

            <EliteHUD title="Daily Sync" subtitle="Rhythm Analysis" icon={Activity} />
        </PhysicsContainer>
    );
};

// --- 3. QUICK CAPTURE: Gyro Core ---
export const CaptureVisual = () => {
    return (
        <PhysicsContainer className="bg-[#020205] flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-[#020205] to-[#020205]" />

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Ring 1 (Slow) */}
                <motion.div
                    className="absolute w-full h-full border border-orange-500/30 rounded-full"
                    animate={{ rotateX: 360, rotateY: 180 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                {/* Ring 2 (Medium) */}
                <motion.div
                    className="absolute w-[80%] h-[80%] border border-orange-400/50 rounded-full border-t-transparent border-b-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                {/* Ring 3 (Fast) */}
                <motion.div
                    className="absolute w-[60%] h-[60%] border-[2px] border-orange-300/80 rounded-full border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Core */}
                <div className="absolute z-20 w-12 h-12 bg-orange-500 rounded-full shadow-[0_0_40px_#f97316] animate-pulse flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
            </div>

            <EliteHUD title="Voice Command" subtitle="Listening Mode" icon={Zap} />
        </PhysicsContainer>
    );
};

// --- 4. VAULT SECURITY: Holo-Grid ---
export const VaultVisual = () => {
    return (
        <PhysicsContainer className="bg-[#020205]">
            {/* 3D Grid Floor */}
            <div className="absolute inset-0 z-0 perspective-1000">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_scale(2)] origin-bottom opacity-50" />
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative">
                    {/* Shield Layers */}
                    <motion.div
                        className="absolute -inset-4 border border-sky-500/30 rounded-xl"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative bg-sky-900/20 backdrop-blur-md p-6 rounded-xl border border-sky-500/50 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                        <Shield className="w-12 h-12 text-sky-400" />
                        {/* Scanning Beam */}
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-[2px] bg-sky-200 shadow-[0_0_15px_white] z-20"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
            </div>

            <EliteHUD title="Secure Vault" subtitle="Encryption Active" icon={Shield} />
        </PhysicsContainer>
    );
};
