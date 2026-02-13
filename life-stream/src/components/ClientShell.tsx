"use client";

import React from "react";
import dynamic from "next/dynamic";
import CleanConsole from "@/components/CleanConsole";
import NotificationManager from "@/components/NotificationManager";

// ssr: false is safe here because ClientShell is a "use client" component
const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), {
    ssr: false
});

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
            <OnboardingModal />
            <NotificationManager />
            {children}
        </>
    );
}
