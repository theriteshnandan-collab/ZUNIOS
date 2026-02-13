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
        // We run this always for the "Mind OS" experience
        const suppressedWarnings = [
            "preloaded using link preload but not used",
            "Manifest: Enctype should be set",
            "Failed to load script from /_vercel/insights/script.js",
            "Vercel Web Analytics",
            "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"
        ];

        const originalWarn = console.warn;
        const originalError = console.error;
        const originalLog = console.log;

        const silenceFilter = (...args: any[]) => {
            if (typeof args[0] === "string" && suppressedWarnings.some(sw => args[0].includes(sw))) {
                return true; // Silence it
            }
            return false;
        };

        console.warn = (...args: any[]) => {
            if (silenceFilter(...args)) return;
            originalWarn.apply(console, args);
        };

        console.error = (...args: any[]) => {
            if (silenceFilter(...args)) return;
            originalError.apply(console, args);
        };

        console.log = (...args: any[]) => {
            if (silenceFilter(...args)) return;
            originalLog.apply(console, args);
        };

        return () => {
            console.warn = originalWarn;
            console.error = originalError;
            console.log = originalLog;
        };
    }, []);

    return null;
}
