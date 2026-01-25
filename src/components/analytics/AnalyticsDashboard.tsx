"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import MoodChart from "./MoodChart";
import CategoryPie from "./CategoryPie";
import ActivityHeatmap from "./ActivityHeatmap";
import { getMoodTrends, getCategoryDistribution } from "@/lib/analytics";
import { Sparkles, TrendingUp, PieChart as PieIcon, Radar } from "lucide-react";
import CognitiveRadar from "./CognitiveRadar";


interface AnalyticsDashboardProps {
    entries: any[];
}

export default function AnalyticsDashboard({ entries }: AnalyticsDashboardProps) {
    const moodData = useMemo(() => getMoodTrends(entries, 7), [entries]);
    const categoryData = useMemo(() => getCategoryDistribution(entries), [entries]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Neural Analytics
                    </h2>
                    <p className="text-sm text-muted-foreground">Your cognitive patterns over the last 7 days.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood Trends */}
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Mood Velocity
                        </h3>
                    </div>
                    <MoodChart data={moodData} />
                    {/* Legend */}
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/50 px-2">
                        <span>Low (Calm)</span>
                        <span>Mid (Balanced)</span>
                        <span>High (Flow)</span>
                    </div>
                </Card>

                {/* Category Split */}
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <PieIcon className="w-4 h-4 text-amber-400" />
                            Focus Distribution
                        </h3>
                    </div>
                    <CategoryPie data={categoryData} />
                </Card>
            </div>

            {/* Cognitive Radar (New Phase 11) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Radar className="w-4 h-4 text-purple-400" />
                            Cognitive Shape
                        </h3>
                    </div>
                    {/* Transform categoryData for Radar */}
                    <CognitiveRadar data={[
                        { subject: 'Vision', A: categoryData.find(c => c.name === 'dream')?.value || 0, fullMark: 100 },
                        { subject: 'Build', A: categoryData.find(c => c.name === 'idea')?.value || 0, fullMark: 100 },
                        { subject: 'Log', A: categoryData.find(c => c.name === 'win')?.value || 0, fullMark: 100 },
                        { subject: 'Think', A: categoryData.find(c => c.name === 'thought')?.value || 0, fullMark: 100 },
                    ]} />
                </Card>
            </div>

            {/* Activity Heatmap (The Life Map) */}
            <Card className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-pink-400" />
                        The Life Map
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">365 Days</span>
                </div>
                <ActivityHeatmap entries={entries} />
            </Card>

            {/* Insight Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🧠</div>
                <div>
                    <p className="text-sm font-medium text-white">AI Copilot Insight</p>
                    <p className="text-xs text-muted-foreground">
                        {entries.length > 5
                            ? "Your data suggests you are most creative in the mornings. Consider scheduling 'Idea' sessions then."
                            : "Keep logging entries to unlock personalized neural insights."}
                    </p>
                </div>
            </div>
        </div>
    );
}
