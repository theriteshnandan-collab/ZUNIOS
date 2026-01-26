import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DreamCardSkeleton() {
    return (
        <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm p-4 h-[180px] flex flex-col gap-3">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Header */}
            <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-20 bg-white/10" />
            </div>

            {/* Content Lines */}
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-[90%] bg-white/10" />
                <Skeleton className="h-4 w-[60%] bg-white/10" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-12 rounded-full bg-white/10" />
                    <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
            </div>
        </Card>
    )
}

export function JournalLoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
            {Array.from({ length: 6 }).map((_, i) => (
                <DreamCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Input skeleton for search
export function InputSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 h-12 w-full">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    )
}
