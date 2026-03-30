"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ZuniosLogo from "@/components/ZuniosLogo";

const QUOTE = "The mind is not a vessel to fill. It is an engine to ignite.";
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

// ─── SCAN LINE REVEAL ─────────────────────────────────────────────────────────

function ScanLine({ onDone }: { onDone: () => void }) {
    return (
        <motion.div
            className="fixed inset-x-0 z-[5] pointer-events-none"
            initial={{ top: "0%", opacity: 1 }}
            animate={{ top: "105%", opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            onAnimationComplete={onDone}
        >
            {/* The sweep line */}
            <div className="w-full h-px bg-white/60" />
            {/* Glow trail above it */}
            <div
                className="w-full pointer-events-none"
                style={{
                    height: "120px",
                    marginTop: "-120px",
                    background: "linear-gradient(to top, rgba(255,255,255,0.07) 0%, transparent 100%)",
                }}
            />
        </motion.div>
    );
}

// ─── WORD REVEAL ──────────────────────────────────────────────────────────────

function QuoteReveal({ text, revealed }: { text: string; revealed: boolean }) {
    const words = text.split(" ");
    return (
        <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif font-medium leading-[1.18] tracking-tight text-white text-center max-w-4xl mx-auto">
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={revealed ? { y: 0 } : { y: "110%" }}
                        transition={{
                            duration: 0.75,
                            ease: EXPO_OUT,
                            delay: 0.05 + i * 0.055,
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </h1>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ManifestoPage() {
    const [scanDone, setScanDone] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="bg-[#080808] text-white min-h-screen overflow-hidden selection:bg-white/20 selection:text-black">

            {/* One-shot scan line on load */}
            <AnimatePresence>
                {mounted && !scanDone && (
                    <ScanLine onDone={() => setScanDone(true)} />
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-5">
                    <Link
                        href="/journal"
                        className="group flex items-center gap-2 text-white/30 hover:text-white transition-colors duration-300"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em]">Core</span>
                    </Link>
                    <div className="h-3.5 w-px bg-white/10" />
                    <ZuniosLogo size="sm" showText={false} />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.6 }}
                    className="text-[9px] font-mono text-white/20 uppercase tracking-[0.55em]"
                >
                    ZUNIOS — MANIFESTO — 001
                </motion.p>
            </nav>

            {/* Hero — full viewport centered */}
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">

                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={scanDone ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.1 }}
                    className="text-[9px] font-mono text-white/20 uppercase tracking-[0.7em] mb-12"
                >
                    MIND OS
                </motion.p>

                {/* Main quote */}
                <QuoteReveal text={QUOTE} revealed={scanDone} />

                {/* Silver hairline — draws in after words */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={scanDone ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.2, ease: EXPO_OUT, delay: 0.8 }}
                    className="mt-14 w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent origin-center"
                />

                {/* Source attribution */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={scanDone ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 1.6 }}
                    className="mt-6 text-[9px] font-mono text-white/18 uppercase tracking-[0.6em]"
                >
                    — Plutarch
                </motion.p>

                {/* Breathing pulse at bottom */}
                <motion.div
                    animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.4, 0.8] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 2.5, ease: "easeInOut" }}
                    className="absolute bottom-12 w-1 h-1 rounded-full bg-white"
                />
            </main>
        </div>
    );
}
