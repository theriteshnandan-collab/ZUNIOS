"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import DreamInsightModal from "@/components/DreamInsightModal";
import { cn } from "@/lib/utils";

interface SemanticSearchProps {
    className?: string;
}

export default function SemanticSearch({ className }: SemanticSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSemantic, setIsSemantic] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setError(null);
        setResults([]);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim(), count: 10, threshold: 0.3 }), // Lower threshold for more results
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`Search failed with status ${res.status}`);
            }

            const data = await res.json();
            setResults(data.results || []);
            setIsSemantic(!!data.isSemantic);

            if (data.error && data.error.includes("migration")) {
                setError("Note: Running in text-fallback mode. Complete Supabase migration for true Semantic Intelligence.");
            }
        } catch (err: any) {
            console.error("Search failed:", err);
            setError(err.name === 'AbortError' ? "Search timed out. Please try again." : "An unexpected error occurred.");
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={cn("w-full flex flex-col", className)}>
            {/* ========== SEARCH BAR CONTAINER ========== */}
            <div className="w-full mb-6 relative z-10">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 h-12 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                        <Search className="w-4 h-4 text-white/40 shrink-0" />
                        <Input
                            placeholder="Describe a feeling, a place, or a dream..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="flex-1 h-full bg-transparent border-none text-sm text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSearching || !query.trim()}
                        className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shrink-0 min-w-[100px] gap-2"
                    >
                        {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Search</span>
                            </>
                        )}
                    </Button>
                </form>

                {/* Status Indicator */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-amber-400 mt-2 flex items-center gap-1 overflow-hidden"
                        >
                            <AlertCircle className="w-3 h-3" />
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* ========== RESULTS CONTAINER ========== */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-white/40 uppercase tracking-widest">
                                    {results.length} result{results.length !== 1 ? 's' : ''} found
                                </p>
                                {isSemantic && (
                                    <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-primary/10 border border-primary/20">
                                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                        <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">AI Semantic Match</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-3">
                                {results.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className="p-4 bg-white/5 border-white/5 hover:border-primary/30 hover:bg-white/10 cursor-pointer transition-all group overflow-hidden relative"
                                            onClick={() => setSelectedEntry(item)}
                                        >
                                            {/* Relevance Indicator Bar */}
                                            {isSemantic && (
                                                <div
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30"
                                                    style={{ height: `${(item.similarity || 0) * 100}%`, opacity: (item.similarity || 0) }}
                                                />
                                            )}

                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0 pl-1">
                                                    <h3 className="font-medium text-white/90 group-hover:text-primary transition-colors truncate">
                                                        {item.theme || "Untitled"}
                                                    </h3>
                                                    <p className="text-white/50 text-sm line-clamp-2 mt-1 italic">
                                                        "{item.content}"
                                                    </p>
                                                </div>
                                                {isSemantic && item.similarity && (
                                                    <span className={cn(
                                                        "text-[10px] font-bold tracking-tighter px-2 py-1 rounded-full shrink-0",
                                                        item.similarity > 0.7
                                                            ? "bg-green-500/20 text-green-400"
                                                            : item.similarity > 0.5
                                                                ? "bg-blue-500/20 text-blue-400"
                                                                : "bg-white/5 text-white/40"
                                                    )}>
                                                        {Math.round(item.similarity * 100)}% Match
                                                    </span>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ========== EMPTY STATE ========== */}
                {hasSearched && results.length === 0 && !isSearching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-white/[0.02] rounded-3xl border border-dashed border-white/5"
                    >
                        <Search className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No conceptual matches found in your subconscious.</p>
                        <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">Try broader terms or emotions</p>
                    </motion.div>
                )}

                {/* ========== MODAL ========== */}
                <AnimatePresence>
                    {selectedEntry && (
                        <DreamInsightModal
                            dream={selectedEntry}
                            onClose={() => setSelectedEntry(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
