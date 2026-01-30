"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Brain, CheckSquare, BookOpen, Loader2, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { generateEmbedding } from "@/lib/vector"; // We might need a Client-Side API route for this if vector.ts is server-only.
// WAIT. vector.ts uses @xenova/transformers which CAN run in browser but it's heavy.
// Better practice: Call an API that does the search.
// Let's build the API route `api/search` first?
// Actually, I'll build the component to call `/api/search`.

interface SearchResult {
    id: string;
    content: string;
    type: 'task' | 'entry';
    similarity: number;
}

export default function NeuralSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        const openSearch = () => setIsOpen(true);

        document.addEventListener("keydown", down);
        window.addEventListener("open-neural-search", openSearch);

        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener("open-neural-search", openSearch);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSearch = async (term: string) => {
        setQuery(term);
        if (term.length < 3) return;

        setIsSearching(true);
        try {
            // We need an API route for this. I will assume /api/search exists.
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: term })
            });
            const data = await res.json();
            setResults(data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const close = () => {
        setIsOpen(false);
        setQuery("");
        setResults([]);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg z-[101]"
                    >
                        <div className="bg-[#0A0A15]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">

                            {/* Input */}
                            <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                                <Search className="w-5 h-5 text-white/40" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Recall a memory..."
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/20"
                                />
                                {isSearching ? (
                                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                ) : (
                                    <div className="px-2 py-1 rounded bg-white/10 text-xs text-white/40 font-mono">ESC</div>
                                )}
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                                {results.length === 0 && query.length > 2 && !isSearching && (
                                    <div className="text-center py-8 text-white/30 text-sm">
                                        No neural matches found.
                                    </div>
                                )}

                                {results.length === 0 && query.length === 0 && (
                                    <div className="text-center py-8">
                                        <Brain className="w-12 h-12 text-white/5 mx-auto mb-3" />
                                        <p className="text-white/30 text-sm">Type to search your extended mind.</p>
                                    </div>
                                )}

                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => {
                                            // Navigate to item
                                            // For now we just close, but ideally we open a detail view
                                            close();
                                        }}
                                        className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-left group"
                                    >
                                        <div className={cn(
                                            "mt-0.5 p-1.5 rounded-lg border border-white/5",
                                            result.type === 'task' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                                        )}>
                                            {result.type === 'task' ? <CheckSquare className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/90 truncate font-medium group-hover:text-white transition-colors">
                                                {result.content}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-white/30 uppercase tracking-wider">{result.type}</span>
                                                <span className="text-[10px] text-white/20">{(result.similarity * 100).toFixed(0)}% Match</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
