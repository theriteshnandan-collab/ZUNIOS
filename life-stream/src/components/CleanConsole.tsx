"use client";

import { useEffect } from "react";

/**
 * CleanConsole (The Nuclear Option)
 * 
 * Silences non-actionable browser warnings that create noise.
 * Specifically targets:
 * 1. Next.js/React Preload timeouts (caused by our intentional long loading screen UX)
 * 2. Manifest enctype assumptions
 */
export default function CleanConsole() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;

        const suppressedWarnings = [
            "preloaded using link preload but not used",
            "Manifest: Enctype should be set",
            "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT" // Vercel Analytics vs AdBlock
        ];

        const originalWarn = console.warn;
        const originalError = console.error;

        console.warn = (...args: any[]) => {
            if (typeof args[0] === "string" && suppressedWarnings.some(sw => args[0].includes(sw))) {
                return;
            }
            originalWarn.apply(console, args);
        };

        console.error = (...args: any[]) => {
            if (typeof args[0] === "string" && suppressedWarnings.some(sw => args[0].includes(sw))) {
                return;
            }
            originalError.apply(console, args);
        };

        return () => {
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    return null;
}
