"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { ArrowLeft, X } from "lucide-react";

interface RevelationViewProps {
    result: any;
    onClose: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export default function RevelationView({ result, onClose, onSave, isSaving }: RevelationViewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    if (!result) return null;

    const content = (
        <AnimatePresence>
            <motion.div
                key="revelation-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[99999] bg-[#080808] text-white flex flex-col w-screen h-screen overflow-y-auto select-text isolate"
            >
                {/* Background Ambient Glow */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none -z-10" />

                {/* Top Navigation Bar */}
                <div className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between z-20 shrink-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-white/60 hover:text-white hover:bg-white/10 gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Input
                    </Button>

                    <div className="flex items-center gap-3">
                        {result.mood && (
                            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-cyan-950/40 text-cyan-400 text-[10px] font-bold tracking-[0.2em] border border-cyan-500/20 uppercase">
                                {result.mood}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full w-9 h-9"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Central Focused Content */}
                <div className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-8 py-4 flex flex-col items-center justify-center text-center space-y-6 z-10 my-auto">
                    {/* Theme / Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="space-y-3 w-full"
                    >
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight">
                            {result.theme || "Insight"}
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
                    </motion.div>

                    {/* The Answer / Interpretation Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="w-full max-h-[50vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl text-left"
                    >
                        <div className="text-zinc-100 leading-relaxed text-base sm:text-lg font-sans font-light whitespace-pre-line space-y-4 select-text">
                            {result.interpretation || "No interpretation generated."}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
                    >
                        <ShinyButton
                            onClick={onSave}
                            disabled={isSaving}
                            className="px-8 py-4 text-base min-w-[200px]"
                        >
                            {isSaving ? "Saving..." : "Log to Consciousness"}
                        </ShinyButton>

                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors text-base"
                        >
                            Discard
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );

    if (!mounted || typeof document === "undefined") {
        return null;
    }

    return createPortal(content, document.body);
}
