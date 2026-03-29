import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightContainer } from "@/components/ui/Spotlight";
import { GlassCard } from "@/components/ui/GlassCard";
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
                    const isLarge = index % 5 === 0;
                    const isWide = index % 7 === 3;
                    const isDeleting = deletingId === dream.id;

                    return (
                        <SwipeableJournalCard 
                            key={dream.id}
                            dream={dream}
                            index={index}
                            isLarge={isLarge}
                            isWide={isWide}
                            isDeleting={isDeleting}
                            onSelect={onSelect}
                            onDelete={onDelete}
                        />
                    );
                })}
            </div>
        </SpotlightContainer>
    );
}

// 🧬 The iOS-Swipable Draft Node
function SwipeableJournalCard({ dream, index, isLarge, isWide, isDeleting, onSelect, onDelete }: any) {
    const ModeIcon = MODE_ICONS[dream.category] || Brain;
    const modeGradient = MODE_COLORS[dream.category] || MODE_COLORS.thought;
    
    // Drag Physics
    const x = useMotionValue(0);
    // When dragged left (-100px), opacity hits 1
    const deleteOpacity = useTransform(x, [-100, -50], [1, 0]);
    const deleteScale = useTransform(x, [-100, -50], [1.2, 0.8]);

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x < -80 && onDelete) {
            onDelete(dream.id);
        }
    };

    return (
        <motion.div
            layoutId={`dream-${dream.id}`}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: index * 0.05
            }}
            className={cn(
                "relative rounded-3xl overflow-hidden",
                isLarge && "md:col-span-2 md:row-span-2",
                isWide && "lg:col-span-2"
            )}
        >
            {/* Background Delete Action Slate */}
            {onDelete && (
                <motion.div 
                    style={{ opacity: deleteOpacity }} 
                    className="absolute inset-0 bg-red-500/20 border border-red-500/50 flex items-center justify-end pr-8"
                >
                    <motion.div style={{ scale: deleteScale }}>
                        <Trash2 className="w-8 h-8 text-red-500 shadow-2xl" />
                    </motion.div>
                </motion.div>
            )}

            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                className="h-full relative z-10 w-full"
            >
                <GlassCard
                    className={cn(
                        "group cursor-pointer h-full w-full",
                        "hover:scale-[1.01] transition-transform duration-300",
                        isDeleting && "opacity-50 pointer-events-none filter blur-sm transition-all duration-500"
                    )}
                    innerLight
                    noiseOpacity={0.04}
                >
                    <div
                        className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100",
                            "bg-gradient-to-br transition-opacity duration-500",
                            modeGradient
                        )}
                    />

                    <div
                        className="relative z-10 p-5 h-full flex flex-col pointer-events-auto"
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
                        </div>

                        {/* Theme/Title */}
                        {dream.theme && (
                            <h3 className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors mb-2 line-clamp-2">
                                {dream.theme}
                            </h3>
                        )}

                        {/* Content Preview */}
                        <p className="text-sm text-zinc-400 line-clamp-3 w-full flex-grow">
                            {dream.content}
                        </p>

                        {/* Mood Badge */}
                        {dream.mood && (
                            <div className="mt-4 pt-3 border-t border-white/[0.05]">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.05] text-xs text-zinc-400">
                                    {dream.mood}
                                </span>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
