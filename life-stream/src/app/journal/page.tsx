"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client"; // Use standard client for sessions
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    Calendar as CalendarIcon,
    BarChart3,
    ArrowLeft,
    Sparkles,
    Download,
    Trash2,
    Loader2,
    LayoutGrid,
    Moon,
    Lightbulb,
    Trophy,
    BrainCircuit
} from "lucide-react";
import dynamic from "next/dynamic";

const DreamInsightModal = dynamic(() => import("@/components/DreamInsightModal"), { ssr: false });
const DataExportModal = dynamic(() => import("@/components/DataExportModal").then(mod => mod.DataExportModal), { ssr: false });
const SocialShare = dynamic(() => import("@/components/SocialShare").then(mod => mod.SocialShare), { ssr: false });

import DreamImage from "@/components/DreamImage";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import VoiceInput from "@/components/VoiceInput";
import SemanticSearch from "@/components/SemanticSearch";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { calculateStats } from "@/lib/gamification";
import { calculateJournalStats } from "@/lib/journal-streaks";
import { JournalStreakCard } from "@/components/analytics/JournalStreakCard";
import type { Dream } from "@/types/dream";
import { JournalLoadingGrid } from "@/components/skeletons/DreamCardSkeleton";
import { useTaskStore } from "@/stores/taskStore";
import { calculateTotalXP, getLevelInfo } from "@/lib/leveling";
import { calculateTaskStats, getEarnedBadges as getTaskBadges } from "@/lib/task-gamification";
import { getStreakBadges } from "@/lib/journal-streaks";
import LevelProgress from "@/components/game/LevelProgress";
import { groupDreamsByDate, getSortedDreamKeys } from "@/lib/journal-grouping";
import TitanJournalGrid from "@/components/TitanJournalGrid";
import { DateNavigator } from "@/components/journal/DateNavigator";
import { format } from "date-fns";



export default function JournalPage() {
    const { user, loading: authLoading } = useAuth();
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
    const supabase = createClient(); // Initialize standard client
    const [selectedTab, setSelectedTab] = useState('all');
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Added missing state

    // XP & Leveling
    const { tasks, fetchTasks } = useTaskStore();

    // Calculate stats & badges for XP
    const journalStats = calculateJournalStats(dreams);
    const taskStats = calculateTaskStats(tasks);

    const earnedStreakBadges = getStreakBadges(journalStats).filter(b => b.earned);
    const earnedTaskBadges = getTaskBadges(taskStats).filter(b => b.earned);
    const allBadges = [...earnedStreakBadges, ...earnedTaskBadges]; // Combine badges for XP

    const totalXP = calculateTotalXP(dreams, tasks, allBadges);
    const levelInfo = getLevelInfo(totalXP);


    // Fetch entries on mount



    const fetchDreams = async () => {
        setIsLoading(true);

        const stored = localStorage.getItem('guest_dreams');
        const localEntries = stored ? JSON.parse(stored) : [];

        // GUEST MODE FETCH
        if (!user) {
            const { data, error } = await supabase
                .from('entries')
                .select('*')
                .eq('user_id', 'guest')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Fetch error:", error);
                setDreams(localEntries);
            } else {
                const dbEntries = data || [];
                const merged = [...localEntries, ...dbEntries].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setDreams(merged);
            }
            setIsLoading(false);
            return;
        }

        // AUTH MODE FETCH
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            toast.error("Failed to load entries: " + error.message);
            setDreams(localEntries);
        } else {
            const dbEntries = data || [];
            console.log(`Fetched ${dbEntries.length} entries from Cloud, ${localEntries.length} from Local.`);
            const merged = [...localEntries, ...dbEntries].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setDreams(merged);
        }
        setIsLoading(false);
    };

    // Fetch entries once Auth state is determined
    useEffect(() => {
        if (!authLoading) {
            console.log("Auth determined. User:", user?.id || 'guest');
            fetchDreams();
            fetchTasks();
        }
    }, [authLoading, user?.id]);

    // Auto-Migrate Old Data
    useEffect(() => {
        if (!authLoading && user) {
            const hasMigrated = localStorage.getItem('zunios_migrated_v1');
            if (!hasMigrated) {
                fetch('/api/migrate', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.count > 0) {
                            toast.success(`Recovered ${data.count} old memories`);
                            fetchDreams(); // Refresh list
                        }
                        localStorage.setItem('zunios_migrated_v1', 'true');
                    })
                    .catch(err => console.error("Auto-migration failed", err));
            }
        }
    }, [authLoading, user?.id]);

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm("Are you sure you want to want to delete this memory?")) return;

        setDeletingId(id);

        let error;
        // GUEST MODE DELETE
        if (!user) {
            // Remove from local storage first
            const stored = localStorage.getItem('guest_dreams');
            if (stored) {
                const localEntries = JSON.parse(stored);
                localStorage.setItem('guest_dreams', JSON.stringify(localEntries.filter((d: any) => d.id !== id)));
            }

            const res = await supabase
                .from('entries')
                .delete()
                .eq('id', id)
                .eq('user_id', 'guest');
            error = res.error;
        } else {
            // AUTH MODE DELETE
            const res = await supabase
                .from('entries')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);
            error = res.error;
        }

        if (error) {
            toast.error("Failed to delete from cloud");
        } else {
            setDreams(prev => prev.filter(d => d.id !== id));
            toast.success("Memory erased");
            if (selectedDream?.id === id) setSelectedDream(null);
        }
        setDeletingId(null);
    };

    // Unified "Think" filter
    const filteredDreams = selectedTab === 'all'
        ? dreams
        : dreams.filter(d => {
            if (selectedTab === 'thought') {
                return d.category === 'thought' || d.category === 'journal' || !d.category;
            }
            return d.category === selectedTab;
        });

    const handleDateSelect = (date: Date) => {
        // Toggle: if clicking the same date, clear it. Else set it.
        if (selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
            setSelectedDate(undefined);
            toast.info("Showing all memories");
        } else {
            setSelectedDate(date);
            toast.success(`Traveled to ${format(date, "MMMM do")}`);
        }
    };

    // Filter by Date if selected
    const viewDreams = selectedDate
        ? filteredDreams.filter(d => format(new Date(d.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
        : filteredDreams;

    // Grouping (only needed if NOT in focus mode, but we can compute it cheaply)
    const groupedDreams = groupDreamsByDate(viewDreams);
    const sortedKeys = getSortedDreamKeys(groupedDreams);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
                            Memory Bank
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExportOpen(true)}
                            className="bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* 1. Stats Row & Calendar Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Level & Streak (Compact) */}
                        <div className="md:col-span-1">
                            <LevelProgress levelInfo={levelInfo} />
                        </div>
                        <div className="md:col-span-1">
                            <JournalStreakCard stats={journalStats} />
                        </div>

                        {/* Calendar (Rectangular Dashboard Widget) */}
                        <div className="md:col-span-2">
                            <DateNavigator dreams={dreams} onDateSelect={handleDateSelect} />
                        </div>
                    </div>

                    {/* 2. Search & Filter Row */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[70px] z-40 bg-[#0a0a0a]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                                placeholder="Search your mind..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/5 border-white/20 focus:border-purple-500/50 text-white placeholder:text-zinc-500 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            <TabButton active={selectedTab === 'all'} onClick={() => setSelectedTab('all')} icon={LayoutGrid} label="All" count={dreams.length} />
                            <TabButton active={selectedTab === 'dream'} onClick={() => setSelectedTab('dream')} icon={Moon} label="Visions" count={dreams.filter(d => d.category === 'dream').length} color="text-purple-400" />
                            <TabButton active={selectedTab === 'idea'} onClick={() => setSelectedTab('idea')} icon={Lightbulb} label="Builds" count={dreams.filter(d => d.category === 'idea').length} color="text-amber-400" />
                            <TabButton active={selectedTab === 'win'} onClick={() => setSelectedTab('win')} icon={Trophy} label="Logs" count={dreams.filter(d => d.category === 'win').length} color="text-emerald-400" />
                            <TabButton active={selectedTab === 'thought'} onClick={() => setSelectedTab('thought')} icon={BrainCircuit} label="Thoughts" count={dreams.filter(d => d.category === 'thought').length} color="text-blue-400" />
                        </div>
                    </div>


                    {/* 4. Main Content (Focus Mode or Timeline) */}
                    <div className="min-h-[500px]">
                        {isLoading ? (
                            <JournalLoadingGrid />
                        ) : filteredDreams.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-white/20" />
                                </div>
                                <h3 className="text-xl font-medium text-white/50">No memories found</h3>
                                <p className="text-sm text-white/30 mt-2">Start capturing your journey to see it here.</p>
                                <Button asChild className="mt-6 bg-white/10 hover:bg-white/20 text-white border-0">
                                    <Link href="/">Create New Entry</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Focus Mode Header */}
                                {selectedDate && (
                                    <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl backdrop-blur-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-full">
                                                <CalendarIcon className="w-5 h-5 text-purple-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white">
                                                    {format(selectedDate, "MMMM do, yyyy")}
                                                </h2>
                                                <p className="text-xs text-white/50">
                                                    {viewDreams.length} Entries found
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedDate(undefined)}
                                            className="hover:bg-purple-500/20 hover:text-purple-300"
                                        >
                                            Clear Filter
                                        </Button>
                                    </div>
                                )}

                                {sortedKeys.map((dateKey) => (
                                    <div key={dateKey} id={`month-${dateKey}`} className="relative">
                                        {/* Only show Month Header if NOT in Focus Mode (redundant) */}
                                        {!selectedDate && (
                                            <div className="sticky top-[80px] z-[5] py-4 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 mb-6 flex items-baseline justify-between">
                                                <h2 className="text-2xl font-serif font-bold tracking-tight text-white/90">
                                                    {dateKey}
                                                </h2>
                                                <span className="text-xs font-mono text-white/30">
                                                    {groupedDreams[dateKey].length} Entries
                                                </span>
                                            </div>
                                        )}

                                        <TitanJournalGrid
                                            dreams={groupedDreams[dateKey]}
                                            onSelect={setSelectedDream}
                                            onDelete={handleDelete}
                                            deletingId={deletingId}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <DreamInsightModal
                    dream={selectedDream}
                    isOpen={!!selectedDream}
                    onClose={() => setSelectedDream(null)}
                />

                <DataExportModal
                    entries={dreams}
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                />
            </main >
        </div >
    );
}

function TabButton({ active, onClick, icon: Icon, label, count, color = "text-white" }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", active ? color : "text-white/30")} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {count > 0 && (
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/40">
                    {count}
                </span>
            )}
        </button>
    );
}

function Badge({ category }: { category?: string }) {
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
