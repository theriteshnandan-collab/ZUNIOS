"use client";

import { useState, useEffect } from "react";
import { EyeOff, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PrivacyShield() {
    const [isBlurred, setIsBlurred] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Toggle blur on 'Escape' key double press (or single long press?)
    // Let's do a simple shortcut: 'Alt + P' or just a global 'Esc' logic if appropriate.
    // For now, let's stick to a UI toggle.

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle on 'Alt + L' (Lock)
            if (e.altKey && e.key === 'l') {
                setIsBlurred(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleBlur = () => setIsBlurred(!isBlurred);

    return (
        <>
            {/* The Blur Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 transition-all duration-500 pointer-events-none backdrop-blur-none",
                    isBlurred && "backdrop-blur-xl bg-black/40 pointer-events-auto"
                )}
            >
                {isBlurred && (
                    <div className="flex flex-col items-center justify-center h-full text-white animate-in fade-in zoom-in duration-300">
                        <Lock className="w-16 h-16 mb-4 text-white/50" />
                        <h2 className="text-2xl font-bold tracking-widest uppercase text-white/80">Vault Locked</h2>
                        <p className="text-white/40 mt-2 text-sm">Press Alt + L or Click to Unlock</p>
                        <Button
                            variant="outline"
                            className="mt-8 border-white/20 hover:bg-white/10"
                            onClick={toggleBlur}
                        >
                            Enter Passcode (Mock)
                        </Button>
                    </div>
                )}
            </div>

            {/* The Trigger Button (Fixed Bottom Left) */}
            <div
                className="fixed bottom-6 left-6 z-[60]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full bg-black/20 hover:bg-black/40 text-white/50 transition-all",
                        isBlurred && "text-white bg-white/10 hover:bg-white/20"
                    )}
                    onClick={toggleBlur}
                >
                    {isBlurred ? <EyeOff /> : <Eye />}
                </Button>

                {/* Tooltip */}
                <div className={cn(
                    "absolute left-12 top-2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded transition-opacity duration-200",
                    isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    {isBlurred ? "Unlock View" : "Blur Mode (Alt+L)"}
                </div>
            </div>
        </>
    );
}
