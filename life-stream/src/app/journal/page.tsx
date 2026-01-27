"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
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
import DreamInsightModal from "@/components/DreamInsightModal";
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
import { DataExportModal } from "@/components/DataExportModal";
import type { Dream } from "@/types/dream";
import { JournalLoadingGrid } from "@/components/skeletons/DreamCardSkeleton";
import { SocialShare } from "@/components/SocialShare";
import { useTaskStore } from "@/stores/taskStore";
import { calculateTotalXP, getLevelInfo } from "@/lib/leveling";
import { calculateTaskStats, getEarnedBadges as getTaskBadges } from "@/lib/task-gamification";
import { getStreakBadges } from "@/lib/journal-streaks";
import LevelProgress from "@/components/game/LevelProgress";
import { groupDreamsByDate, getSortedDreamKeys } from "@/lib/journal-grouping";
import { JournalGrid } from "@/components/JournalGrid";
import { DateNavigator } from "@/components/journal/DateNavigator";
import { format } from "date-fns";



export default function JournalPage() {
    const { user, isLoaded } = useUser();
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isExportOpen, setIsExportOpen] = useState(false);

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

        // GUEST MODE FETCH
        if (!user) {
            if (!supabase) {
                console.error("Supabase client not initialized");
                setIsLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('dreams')
                .select('*')
                .eq('user_id', 'guest')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load entries");
            } else {
                setDreams(data || []);
            }
            setIsLoading(false);
            return;
        }

        // AUTH MODE FETCH
        if (!supabase) {
            console.error("Supabase client not initialized");
            setIsLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('dreams')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load entries");
        } else {
            setDreams(data || []);
        }
        setIsLoading(false);
    };

    // Fetch entries on mount
    useEffect(() => {
        if (isLoaded) {
            fetchDreams();
            fetchTasks(); // Fetch tasks for XP calculation
        }
    }, [isLoaded, user]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this memory?")) return;

        if (!supabase) {
            toast.error("Database not available");
            return;
        }

        setDeletingId(id);

        let error;
        // GUEST MODE DELETE
        if (!user) {
            const res = await supabase
                .from('dreams')
                .delete()
                .eq('id', id)
                .eq('user_id', 'guest');
            error = res.error;
        } else {
            // AUTH MODE DELETE
            const res = await supabase
                .from('dreams')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);
            error = res.error;
        }

        if (error) {
            toast.error("Failed to delete");
        } else {
            setDreams(prev => prev.filter(d => d.id !== id));
            toast.success("Memory erased");
            if (selectedDream?.id === id) setSelectedDream(null);
        }
        setDeletingId(null);
    };

    // Filter dreams based on tab
    const filteredDreams = selectedTab === 'all'
        ? dreams
        : dreams.filter(d => d.category === selectedTab || (selectedTab === 'journal' ? !d.category : false));

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
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
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
                        <div className="h-8 w-[1px] bg-white/10 mx-2" />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* 1. Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <LevelProgress levelInfo={levelInfo} />
                        <JournalStreakCard stats={journalStats} />
                        {/* Analytics Widget */}
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <h3 className="text-sm font-medium text-white/50 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/70">Average Mood</span>
                                    <span className="text-purple-400 font-medium">Coming soon</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/70">Top Theme</span>
                                    <span className="text-pink-400 font-medium">Coming soon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Search & Filter Row */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[70px] z-40 bg-[#0a0a0a]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                                placeholder="Search your mind..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-black/50 border-white/5 focus:border-purple-500/50 transition-all"
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

                    {/* 3. Time Travel (Calendar) */}
                    <div className="w-full">
                        <DateNavigator dreams={dreams} onDateSelect={handleDateSelect} />
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

                                        <JournalGrid
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
