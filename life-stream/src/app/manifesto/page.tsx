"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";

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
            <div className="w-full h-px bg-white/60" />
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

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Shrink, fade, blur as user scrolls down
    const scale  = useTransform(scrollYProgress, [0, 0.5], [1, 0.82]);
    const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
    const blurPx = useTransform(scrollYProgress, [0, 0.4], [0, 12]);
    const filter = useMotionTemplate`blur(${blurPx}px)`;
    const y      = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

    useEffect(() => { setMounted(true); }, []);

    return (
        <div
            ref={containerRef}
            className="bg-[#080808] text-white selection:bg-white/20 selection:text-black md:min-h-[180vh]"
            style={{ minHeight: "100vh" }}
        >
            {/* One-shot scan line on load */}
            <AnimatePresence>
                {mounted && !scanDone && (
                    <ScanLine onDone={() => setScanDone(true)} />
                )}
            </AnimatePresence>

            {/* Manifesto label — top right, sits below FloatingNav */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.6 }}
                className="fixed top-5 right-8 z-40 text-[9px] font-mono text-white/20 uppercase tracking-[0.55em] hidden md:block"
            >
                MANIFESTO — 001
            </motion.p>

            {/* Hero — sticky parallax */}
            <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-6 text-center pointer-events-none">
                <motion.div
                    style={{ scale, opacity, filter, y }}
                    className="flex flex-col items-center"
                >
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

                    {/* Silver hairline */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={scanDone ? { scaleX: 1, opacity: 1 } : {}}
                        transition={{ duration: 1.2, ease: EXPO_OUT, delay: 0.8 }}
                        className="mt-14 w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent origin-center"
                    />

                    {/* Attribution */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={scanDone ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="mt-6 text-[9px] font-mono text-white/20 uppercase tracking-[0.6em]"
                    >
                        — Zunios
                    </motion.p>
                </motion.div>

                {/* Breathing pulse */}
                <motion.div
                    animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.4, 0.8] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 2.5, ease: "easeInOut" }}
                    className="absolute bottom-12 w-1 h-1 rounded-full bg-white"
                />
            </div>

            {/* Bottom CTA — appears at the very end of scroll */}
            <div className="relative z-10 flex flex-col items-center justify-center pb-40 px-6 bg-[#080808]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center space-y-10"
                >
                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="space-y-4 text-center">
                        <p className="text-white/20 font-mono text-[9px] uppercase tracking-[0.6em]">System Initialization</p>
                        <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight">Ready to begin?</h2>
                    </div>
                    <motion.a
                        href="/#titan-input"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 rounded-full bg-white text-black font-bold text-sm transition-all duration-500"
                    >
                        Initialize Mind OS →
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
}
