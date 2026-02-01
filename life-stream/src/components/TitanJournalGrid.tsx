"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightContainer } from "@/components/ui/Spotlight";
import { GlassCard } from "@/components/ui/GlassCard";
import DreamImage from "@/components/DreamImage";
import { formatDistanceToNow } from "date-fns";
import { Eye, Zap, Target, Brain, Trash2, Share2 } from "lucide-react";
import type { Dream } from "@/types/dream";

const MODE_ICONS: Record<string, React.ElementType> = {
    dream: Eye,
    idea: Zap,
    win: Target,
    journal: Brain,
    thought: Brain
};

const MODE_COLORS: Record<string, string> = {
    dream: "from-violet-500/20 to-purple-500/10",
    idea: "from-amber-500/20 to-orange-500/10",
    win: "from-emerald-500/20 to-green-500/10",
    journal: "from-blue-500/20 to-cyan-500/10",
    thought: "from-zinc-500/20 to-slate-500/10"
};

interface TitanJournalGridProps {
    dreams: Dream[];
    onSelect: (dream: Dream) => void;
    onDelete?: (id: string) => void;
    deletingId?: string | null;
}

/**
 * TitanJournalGrid
 * 
 * A Bento-style masonry grid with:
 * - CSS Grid (no JS masonry)
 * - GlassCard items with Scrubbed Glass effect
 * - SpotlightContainer for cursor-following reveal
 */
export default function TitanJournalGrid({
    dreams,
    onSelect,
    onDelete,
    deletingId
}: TitanJournalGridProps) {
    if (!dreams || dreams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-lg font-light">No entries yet.</p>
                <p className="text-zinc-600 text-sm mt-1">Start capturing your thoughts above.</p>
            </div>
        );
    }

    return (
        <SpotlightContainer
            className="w-full"
            spotlightSize={600}
            spotlightColor="rgba(255, 255, 255, 0.04)"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
                {dreams.map((dream, index) => {
                    const ModeIcon = MODE_ICONS[dream.category] || Brain;
                    const modeGradient = MODE_COLORS[dream.category] || MODE_COLORS.thought;
                    const isDeleting = deletingId === dream.id;

                    // Bento sizing: make some cards bigger
                    const isLarge = index % 5 === 0; // Every 5th card is large
                    const isWide = index % 7 === 3; // Some cards are wide

                    return (
                        <motion.div
                            key={dream.id}
                            layoutId={`dream-${dream.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                delay: index * 0.05
                            }}
                            className={cn(
                                isLarge && "md:col-span-2 md:row-span-2",
                                isWide && "lg:col-span-2"
                            )}
                        >
                            <GlassCard
                                className={cn(
                                    "group cursor-pointer h-full",
                                    "hover:scale-[1.02] transition-transform duration-300",
                                    isDeleting && "opacity-50 pointer-events-none"
                                )}
                                innerLight
                                noiseOpacity={0.04}
                            >
                                {/* Mood Gradient Overlay */}
                                <div
                                    className={cn(
                                        "absolute inset-0 opacity-0 group-hover:opacity-100",
                                        "bg-gradient-to-br transition-opacity duration-500",
                                        modeGradient
                                    )}
                                />

                                {/* Content */}
                                <div
                                    className="relative z-10 p-5 h-full flex flex-col"
                                    onClick={() => onSelect(dream)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                                                <ModeIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                                    {dream.category}
                                                </p>
                                                <p className="text-xs text-zinc-600">
                                                    {formatDistanceToNow(new Date(dream.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Share logic
                                                }}
                                                className="p-1.5 rounded-full hover:bg-white/[0.1] transition-colors"
                                            >
                                                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                                            </button>
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(dream.id);
                                                    }}
                                                    className="p-1.5 rounded-full hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Theme/Title */}
                                    {dream.analysis?.theme && (
                                        <h3 className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors mb-2 line-clamp-2">
                                            {dream.analysis.theme}
                                        </h3>
                                    )}

                                    {/* Content Preview */}
                                    <p className="text-sm text-zinc-400 line-clamp-3 flex-1">
                                        {dream.content}
                                    </p>

                                    {/* Image (if available) */}
                                    {dream.image_url && isLarge && (
                                        <div className="mt-4 rounded-xl overflow-hidden">
                                            <DreamImage
                                                prompt={dream.analysis?.visualPrompt || dream.content}
                                                className="w-full h-40 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Mood Badge */}
                                    {dream.analysis?.mood && (
                                        <div className="mt-4 pt-3 border-t border-white/[0.05]">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.05] text-xs text-zinc-400">
                                                {dream.analysis.mood}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    );
                })}
            </div>
        </SpotlightContainer>
    );
}
