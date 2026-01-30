
import React from 'react';
import { cn } from "@/lib/utils";

interface PageContainerProps {
    children: React.ReactNode;
    className?: string; // Allow custom styles
    /**
     * If true, removes the default safe area padding. 
     * Use this only if you are handling padding manually for a full-screen immersive view.
     */
    noSafePadding?: boolean;
}

/**
 * Global Wrapper Component for "Safe Layouts"
 * 
 * Purpose: 
 * Ensures every page has:
 * 1. Correct bottom padding so content isn't hidden behind the Fixed Bottom Nav & FAB.
 * 2. Proper full-height constraints.
 * 3. Consistent base structure.
 * 
 * Behavior:
 * - Mobile: Adds pb-32 (128px) by default. This clears Bottom Nav (64px) + FAB Area + Spacing.
 * - Desktop: Adds standard footer clearance if needed, or minimal padding.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
    children,
    className,
    noSafePadding = false
}) => {
    return (
        <div
            className={cn(
                "w-full min-h-screen relative flex flex-col",
                // Mobile: Huge bottom padding to clear Navbar + FAB
                // Desktop: Standard or minimal padding (Nav is at top)
                !noSafePadding && "pb-32 md:pb-12",
                className
            )}
        >
            {children}
        </div>
    );
};

export default PageContainer;
