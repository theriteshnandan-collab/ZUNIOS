"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import DreamDetailModal from "@/components/DreamDetailModal";
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

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setResults([]);

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim(), count: 10 }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                console.error(`Search HTTP error: ${res.status}`);
                setResults([]);
                return;
            }

            const data = await res.json();
            setResults(data.results || []);
        } catch (err: any) {
            // Handle timeout or network errors gracefully
            if (err.name === 'AbortError') {
                console.log("Search timed out");
            } else {
                console.error("Search failed:", err);
            }
            setResults([]); // Show empty results, don't crash
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className={cn("w-full flex flex-col", className)}>
            {/* ========== SEARCH BAR CONTAINER ========== */}
            <div className="w-full mb-6 relative z-10">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                    {/* INPUT CONTAINER - Completely separate from Button */}
                    <div className="flex-1 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 h-12 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                        <Search className="w-4 h-4 text-white/40 shrink-0" />
                        <Input
                            placeholder="Search your mind..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="flex-1 h-full bg-transparent border-none text-sm text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        />
                    </div>

                    {/* BUTTON - Completely outside the input */}
                    <Button
                        type="submit"
                        disabled={isSearching || !query.trim()}
                        className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shrink-0 min-w-[100px]"
                    >
                        {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Search"
                        )}
                    </Button>
                </form>
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
                            <p className="text-xs text-white/40 uppercase tracking-widest">
                                {results.length} result{results.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="grid gap-3">
                                {results.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className="p-4 bg-white/5 border-white/5 hover:border-primary/30 hover:bg-white/10 cursor-pointer transition-all group"
                                            onClick={() => setSelectedEntry(item)}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-white/90 group-hover:text-primary transition-colors truncate">
                                                        {item.theme || "Untitled"}
                                                    </h3>
                                                    <p className="text-white/50 text-sm line-clamp-2 mt-1">
                                                        {item.content}
                                                    </p>
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] uppercase tracking-wider px-2 py-1 rounded-full shrink-0",
                                                    item.similarity > 0.8
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-white/5 text-white/40"
                                                )}>
                                                    {Math.round(item.similarity * 100)}%
                                                </span>
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
                        className="text-center py-8"
                    >
                        <p className="text-white/40 text-sm">No results found. Try a different query.</p>
                    </motion.div>
                )}

                {/* ========== MODAL ========== */}
                <AnimatePresence>
                    {selectedEntry && (
                        <DreamDetailModal
                            dream={selectedEntry}
                            onClose={() => setSelectedEntry(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
