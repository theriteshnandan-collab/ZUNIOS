"use client";

import { X, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DreamImage from "@/components/DreamImage";
import { useState, useRef } from "react";
import ArtifactCard from "./ArtifactCard";
import { Dream } from "@/types/dream";



interface DreamDetailModalProps {
    dream: Dream | null;
    isOpen?: boolean;
    onClose: () => void;
}

export default function DreamDetailModal({ dream, onClose }: DreamDetailModalProps) {
    // Artifact Generation
    const artifactRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!dream) return null;

    // Parse interpretation if it's stored as JSON string
    let insights: string[] = [];
    if (dream.interpretation) {
        try {
            insights = Array.isArray(dream.interpretation)
                ? dream.interpretation
                : JSON.parse(dream.interpretation as any);
        } catch {
            insights = [];
        }
    }

    const handleShare = async () => {
        if (!process.browser || !artifactRef.current) return;
        setIsGenerating(true);
        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(artifactRef.current, { cacheBust: true, pixelRatio: 2 });

            // Download logic
            const link = document.createElement('a');
            link.download = `kogito-artifact-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            // Optional: Web Share API if supported
            if (navigator.share) {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], "kogito-insight.png", { type: "image/png" });
                await navigator.share({
                    title: 'Kogito Insight',
                    text: 'My latest insight from the OS for my Mind.',
                    files: [file]
                });
            }

        } catch (err) {
            console.error("Artifact generation failed", err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Extract primary role for artifact
    const primaryRole = insights.reduce<string | null>((acc, curr) => {
        if (acc) return acc;
        const parts = curr.split(':');
        const title = parts.length > 1 ? parts[0].trim() : null;
        if (title && (title.includes('CEO') || title.includes('Coach') || title.includes('Stoic'))) return title;
        return null;
    }, null) || (dream.category ? dream.category.toUpperCase() : 'VISIONEER');

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Hidden Layout for Artifact Generation */}
                <div className="fixed top-0 left-0 overflow-hidden w-0 h-0 opacity-0 pointer-events-none">
                    <ArtifactCard
                        ref={artifactRef}
                        mode={dream.category as any || 'dream'}
                        content={dream.theme || 'Untitled'}
                        role={primaryRole}
                        date={new Date(dream.created_at).toLocaleDateString()}
                        keywords={[dream.mood || 'neutral', dream.category || 'insight']}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="bg-background border-white/10 overflow-hidden">
                        {/* Close Button */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-black/50 border-white/10 hover:bg-white/10 text-xs gap-2 backdrop-blur-md"
                                onClick={handleShare}
                                disabled={isGenerating}
                            >
                                {isGenerating ? <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <Share2 className="w-3 h-3" />}
                                {isGenerating ? "Forging..." : "Share Artifact"}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/50 hover:bg-white/20 backdrop-blur-md text-white"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image Side */}
                            <div className="relative aspect-square md:aspect-auto">
                                <DreamImage
                                    src={dream.image_url || ''}
                                    alt={dream.theme || 'Dream'}
                                    className="w-full h-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Content Side */}
                            <div className="p-6 space-y-6">
                                {/* Header */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                            {dream.mood}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(dream.created_at).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold font-serif">{dream.theme}</h2>
                                </div>

                                {/* Dream Content */}
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Insight</h3>
                                    <p className="text-foreground leading-relaxed font-serif text-lg">{dream.content}</p>
                                </div>

                                {/* Insights */}
                                {insights.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-3 font-serif uppercase tracking-widest text-[10px]">
                                            {dream.category === 'idea' ? 'Executive Board Report' :
                                                dream.category === 'win' ? 'Performance Brief' :
                                                    dream.category === 'journal' ? 'Council Wisdom' :
                                                        'Dream Analysis'}
                                        </h3>
                                        <div className="space-y-3">
                                            {insights.map((insight, index) => {
                                                // Parser logic embedded for simplicity
                                                const parts = insight.split(':');
                                                const title = parts.length > 1 ? parts[0].trim() : null;
                                                const content = parts.length > 1 ? parts.slice(1).join(':').trim() : insight;
                                                const isSpecial = title && (title.includes('CEO') || title.includes('CTO') || title.includes('CMO') || title.includes('Stoic') || title.includes('Zen') || title.includes('Leverage'));

                                                return (
                                                    <div
                                                        key={index}
                                                        className="bg-white/5 rounded-lg p-3 text-sm leading-relaxed font-serif text-base border border-white/5 flex flex-col gap-2"
                                                    >
                                                        {isSpecial && (
                                                            <div className="w-fit">
                                                                <span className="bg-primary/20 text-primary-foreground/90 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-primary/20">
                                                                    {title}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="opacity-90">{content}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* THE GHOST SIGNAL */}
                                {dream.action_suggestion && (
                                    <div className="bg-white/5 border border-primary/20 rounded-lg p-4 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 animate-pulse">
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">
                                                    Ghost Protocol (Next Action)
                                                </h3>
                                                <p className="text-sm font-medium font-serif leading-relaxed">
                                                    {dream.action_suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
