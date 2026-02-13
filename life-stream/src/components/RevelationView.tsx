"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DreamImage from "@/components/DreamImage";
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

            <div className="min-h-screen w-full flex flex-col lg:flex-row">
                {/* LEFT: VISUAL IMMERSION (50% Width) */}
                <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-screen bg-black">
                    <DreamImage
                        src={result.imageUrl}
                        alt={result.theme}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050510] to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#050510]" />
                </div>

                {/* RIGHT: INTELLECTUAL CORE (Text) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 space-y-8 bg-[#050510]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-950/30 text-cyan-400 text-xs font-medium tracking-wide border border-cyan-500/20 uppercase">
                            {result.mood || "ANALYSIS COMPLETE"}
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white leading-[1.1]">
                            {result.theme || "Your Vision"}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full h-px bg-gradient-to-r from-white/20 to-transparent"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        {Array.isArray(result.interpretation) ? (
                            result.interpretation.map((item: string, i: number) => (
                                <p key={i} className="text-gray-300 leading-relaxed text-lg">{item}</p>
                            ))
                        ) : (
                            <p className="text-gray-300 leading-8 text-xl font-light whitespace-pre-wrap">
                                {result.interpretation}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-8 flex gap-4"
                    >
                        <ShinyButton
                            onClick={onSave}
                            disabled={isSaving}
                            className="px-8 py-4 text-base min-w-[180px]"
                        >
                            {isSaving ? "Saving..." : "Save to Core"}
                        </ShinyButton>

                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="px-8 py-4 h-auto text-base border-white/10 hover:bg-white/5"
                        >
                            Discard
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
