"use client";

import React from "react";
import CleanConsole from "@/components/CleanConsole";
import NotificationManager from "@/components/NotificationManager";

interface ClientShellProps {
    children: React.ReactNode;
}

/**
 * ClientShell
 * 
 * Houses all global components that require client-side execution 
 * or ssr:false dynamic imports. Isolates them from Server Components (like RootLayout).
 */
export default function ClientShell({ children }: ClientShellProps) {
    return (
        <>
            <CleanConsole />
            <NotificationManager />
            {children}
        </>
    );
}
