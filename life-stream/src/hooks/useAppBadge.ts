import { useEffect } from 'react';

/**
 * Hook to set the PWA App Badge (The "Red Dot")
 * @param count The number to display on the badge (0 clears it)
 */
export function useAppBadge(count: number) {
    useEffect(() => {
        // Check if the browser supports badging
        if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
            if (count > 0) {
                // Set the badge to the count
                navigator.setAppBadge(count).catch((e) => {
                    console.error("Failed to set app badge", e);
                });
            } else {
                // Clear the badge if count is 0
                navigator.clearAppBadge().catch((e) => {
                    console.error("Failed to clear app badge", e);
                });
            }
        }
    }, [count]);
}
