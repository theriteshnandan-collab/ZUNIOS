"use client";

import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { memoryService, type Memory } from '@/lib/memory-service';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedMemoriesProps {
    content: string;
    currentId?: string;
}

export function RelatedMemories({ content, currentId }: RelatedMemoriesProps) {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMemories() {
            if (!content || content.length < 10) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch more than needed to filter out current
                const results = await memoryService.recall(content, 4);

                // Filter out the current entry itself
                const filtered = results.filter(m => m.id !== currentId).slice(0, 3);
                setMemories(filtered);
            } catch (err) {
                console.error("Failed to fetch memories", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMemories();
    }, [content, currentId]);



    // ... inside component

    if (isLoading) {
        return (
            <div className="space-y-3 mt-8">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full opacity-50" />
            </div>
        );
    }

    if (memories.length === 0) return null;

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-sm font-semibold text-white/50 flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Related Memories
            </h3>

            <div className="grid gap-3">
                {memories.map(memory => (
                    <div
                        key={memory.id}
                        className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default"
                    >
                        <p className="text-sm text-white/80 line-clamp-2 mb-2">"{memory.content}"</p>
                        <div className="flex items-center justify-between text-xs text-white/40">
                            <span>{format(new Date(memory.created_at), 'MMM d, yyyy')}</span>
                            <span className="flex items-center gap-1 text-purple-400">
                                {Math.round(memory.similarity * 100)}% Match
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
