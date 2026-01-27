"use client";

import { Dream } from "@/types/dream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/SocialShare";
import { Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface JournalGridProps {
    dreams: Dream[];
    onSelect: (dream: Dream) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    deletingId: string | null;
}

export function JournalGrid({ dreams, onSelect, onDelete, deletingId }: JournalGridProps) {
    if (dreams.length === 0) return null;

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {dreams.map((dream) => (
                <div key={dream.id} className="break-inside-avoid mb-4">
                    <GlassCard
                        className="relative group cursor-pointer hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                        onClick={() => onSelect(dream)}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <JournalBadge category={dream.category} />
                                <span className="text-xs text-white/30 font-mono">
                                    {formatDistanceToNow(new Date(dream.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Image (if any) */}
                            {dream.image_url && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/5 bg-black/50">
                                    <img
                                        src={dream.image_url}
                                        alt={dream.theme || "Dream visualization"}
                                        className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <p className="text-sm text-white/80 line-clamp-4 mb-4 flex-1 font-serif leading-relaxed tracking-wide">
                                {dream.content}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-2">
                                    {dream.mood && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50">
                                            {dream.mood}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <SocialShare
                                        title={dream.theme || 'New Memory'}
                                        description={dream.content}
                                        className="h-8 w-8 text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all mr-1"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={(e) => onDelete(dream.id, e)}
                                        disabled={deletingId === dream.id}
                                    >
                                        {deletingId === dream.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            ))}
        </div>
    );
}

function JournalBadge({ category }: { category?: string }) {
    const config: any = {
        dream: { label: 'Vision', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
        idea: { label: 'Build', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
        win: { label: 'Log', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
        thought: { label: 'Think', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
    };

    const style = config[category || 'thought'] || config.thought;

    return (
        <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium", style.color)}>
            {style.label}
        </span>
    );
}
