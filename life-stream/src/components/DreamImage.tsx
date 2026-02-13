"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DreamImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function DreamImage({ src, alt, className }: DreamImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isStalled, setIsStalled] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // If it's a base64 data URL or Pollinations, we'll use standard img to bypass optimization issues
    const isBase64 = src.startsWith('data:');
    const isPollinations = src.includes('pollinations.ai') || src.includes('prompt/');
    const fallbackSrc = "https://placehold.co/800x600/050510/666?text=Capturing+Vision...";

    // Force check for completed images (important for cached results)
    useEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoading(false);
        }
    }, [src]);

    // Stalled Timer: If image takes > 12s, show a "Reveal anyway" option
    useEffect(() => {
        if (!isLoading) {
            setIsStalled(false);
            return;
        }
        const timer = setTimeout(() => {
            if (isLoading) setIsStalled(true);
        }, 12000);
        return () => clearTimeout(timer);
    }, [isLoading, src]);

    return (
        <div className={cn("relative overflow-hidden bg-white/5", className)}>
            {/* Loading skeleton */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#050510] to-[#0a0a20] z-10 p-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                        <span className="text-cyan-400/50 text-xs tracking-[0.2em] uppercase font-light animate-pulse">
                            Visualizing Vision...
                        </span>
                    </div>

                    {isStalled && (
                        <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <p className="text-xs text-white/40 italic">Syncing with art engine...</p>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setIsLoading(false)}
                                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] text-white/60 transition-all"
                                >
                                    Reveal Anyway
                                </button>
                                <a
                                    href={src}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-cyan-400/50 hover:text-cyan-400 underline underline-offset-4"
                                >
                                    Open Original Link
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Use standard img for base64, pollinations, or fallback to avoid optimization/proxy issues */}
            {isBase64 || isPollinations || hasError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    ref={imgRef}
                    src={hasError ? fallbackSrc : src}
                    alt={alt}
                    loading="eager"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-700",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={cn(
                        "object-cover transition-opacity duration-700",
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    unoptimized
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}
        </div>
    );
}
