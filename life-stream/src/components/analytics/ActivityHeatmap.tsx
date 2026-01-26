"use client";

import { useMemo } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
    entries: any[];
}

// Category colors matching the app's theme
const CATEGORY_COLORS = {
    dream: "bg-purple-500",
    idea: "bg-yellow-500",
    win: "bg-emerald-500",
    thought: "bg-blue-500",
    empty: "bg-white/10"
};

// New persona labels and icons
const CATEGORY_LABELS = {
    dream: { name: "Vision", icon: "👁️" },
    idea: { name: "Build", icon: "⚡" },
    win: { name: "Log", icon: "🎯" },
    thought: { name: "Think", icon: "🧠" }
};

interface DayData {
    dream: number;
    idea: number;
    win: number;
    thought: number;
    total: number;
}

export default function ActivityHeatmap({ entries }: ActivityHeatmapProps) {
    // Generate dates for the last year
    const days = useMemo(() => {
        const today = new Date();
        const startDate = subDays(today, 364);
        return eachDayOfInterval({ start: startDate, end: today });
    }, []);

    // Map entries to dates with ALL categories tracked
    const activityMap = useMemo(() => {
        const map = new Map<string, DayData>();

        entries.forEach(entry => {
            const dateStr = format(new Date(entry.created_at), 'yyyy-MM-dd');
            const current = map.get(dateStr) || { dream: 0, idea: 0, win: 0, thought: 0, total: 0 };

            // Map 'journal' category to 'thought' for consistency
            const category = entry.category === 'journal' ? 'thought' : (entry.category || 'thought');

            // Increment the specific category count
            if (category in current) {
                (current as any)[category] += 1;
            }
            current.total += 1;

            map.set(dateStr, current);
        });

        return map;
    }, [entries]);

    // Check if it's a "Perfect Day" (all 4 categories logged)
    const isPerfectDay = (data: DayData) => {
        return data.dream > 0 && data.idea > 0 && data.win > 0 && data.thought > 0;
    };

    // Get opacity based on count (more entries = more intense)
    const getOpacity = (count: number) => {
        if (count === 0) return "opacity-20";
        if (count === 1) return "opacity-60";
        if (count === 2) return "opacity-80";
        return "opacity-100";
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/70 uppercase tracking-widest">Life DNA</h3>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <span className="w-4 h-4 rounded border-2 border-yellow-400/50 flex items-center justify-center">✨</span>
                    <span>= Perfect Day</span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[800px]">
                    <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                        {days.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const data = activityMap.get(dateStr) || { dream: 0, idea: 0, win: 0, thought: 0, total: 0 };
                            const perfect = isPerfectDay(data);

                            return (
                                <TooltipProvider key={dateStr} delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/* THE DNA CELL - 2x2 Quadrant Grid */}
                                            <div
                                                className={cn(
                                                    "w-4 h-4 rounded-sm grid grid-cols-2 grid-rows-2 gap-[1px] p-[1px] transition-all hover:scale-150 hover:z-20 cursor-pointer",
                                                    perfect && "ring-2 ring-yellow-400 ring-offset-1 ring-offset-black shadow-lg shadow-yellow-400/30",
                                                    data.total === 0 && "bg-white/5"
                                                )}
                                            >
                                                {/* Top-Left: Dream */}
                                                <div className={cn(
                                                    "rounded-tl-[2px]",
                                                    data.dream > 0 ? CATEGORY_COLORS.dream : CATEGORY_COLORS.empty,
                                                    getOpacity(data.dream)
                                                )} />

                                                {/* Top-Right: Idea */}
                                                <div className={cn(
                                                    "rounded-tr-[2px]",
                                                    data.idea > 0 ? CATEGORY_COLORS.idea : CATEGORY_COLORS.empty,
                                                    getOpacity(data.idea)
                                                )} />

                                                {/* Bottom-Left: Win */}
                                                <div className={cn(
                                                    "rounded-bl-[2px]",
                                                    data.win > 0 ? CATEGORY_COLORS.win : CATEGORY_COLORS.empty,
                                                    getOpacity(data.win)
                                                )} />

                                                {/* Bottom-Right: Thought */}
                                                <div className={cn(
                                                    "rounded-br-[2px]",
                                                    data.thought > 0 ? CATEGORY_COLORS.thought : CATEGORY_COLORS.empty,
                                                    getOpacity(data.thought)
                                                )} />
                                            </div>
                                        </TooltipTrigger>

                                        {/* Rich Tooltip */}
                                        <TooltipContent
                                            className="bg-zinc-900 border-zinc-700 p-3 min-w-[180px]"
                                            side="top"
                                        >
                                            <p className="font-bold text-white mb-2">
                                                {format(day, 'EEEE, MMM do')}
                                            </p>

                                            {data.total > 0 ? (
                                                <div className="space-y-1.5">
                                                    {data.dream > 0 && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                                                            <span className="text-white/70">{CATEGORY_LABELS.dream.icon} {data.dream} {CATEGORY_LABELS.dream.name}{data.dream > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                    {data.idea > 0 && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                                            <span className="text-white/70">{CATEGORY_LABELS.idea.icon} {data.idea} {CATEGORY_LABELS.idea.name}{data.idea > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                    {data.win > 0 && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            <span className="text-white/70">{CATEGORY_LABELS.win.icon} {data.win} {CATEGORY_LABELS.win.name}{data.win > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                    {data.thought > 0 && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                            <span className="text-white/70">{CATEGORY_LABELS.thought.icon} {data.thought} {CATEGORY_LABELS.thought.name}{data.thought > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}

                                                    <div className="border-t border-zinc-700 pt-2 mt-2">
                                                        <p className="text-xs text-white/50">
                                                            Total: {data.total} entr{data.total === 1 ? 'y' : 'ies'}
                                                        </p>
                                                    </div>

                                                    {perfect && (
                                                        <div className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded text-center font-medium">
                                                            ✨ PERFECT DAY ✨
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-white/40 text-sm">No entries</p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px] text-white/50 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                    <span>Vision</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" />
                    <span>Build</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span>Log</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span>Think</span>
                </div>
            </div>
        </div>
    );
}
