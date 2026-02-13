"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/ShinyButton";

interface RevelationViewProps {
    result: any;
    onClose: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export default function RevelationView({ result, onClose, onSave, isSaving }: RevelationViewProps) {
    if (!result) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#050510] text-white overflow-y-auto">
            {/* Close/Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-white/50 hover:text-white hover:bg-white/10"
                >
                    ← Back to Input
                </Button>
            </div>

            <div className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* CONTENT: INTELLECTUAL CORE (Centered Text) */}
                <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-950/20 text-cyan-400 text-[10px] font-bold tracking-[0.2em] border border-cyan-500/10 uppercase mb-4">
                            {result.mood || "ANALYSIS COMPLETE"}
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1] pb-2">
                            {result.theme || "Your Vision"}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="prose prose-invert prose-2xl max-w-2xl mx-auto"
                    >
                        <p className="text-zinc-300 leading-[1.6] text-2xl md:text-3xl font-light italic tracking-tight font-serif">
                            "{result.interpretation}"
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="pt-12 flex flex-col sm:flex-row gap-6 items-center"
                    >
                        <ShinyButton
                            onClick={onSave}
                            disabled={isSaving}
                            className="px-10 py-5 text-lg min-w-[220px]"
                        >
                            {isSaving ? "Saving..." : "Log to Consciousness"}
                        </ShinyButton>

                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-zinc-500 hover:text-white transition-colors text-lg"
                        >
                            Discard Vision
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
