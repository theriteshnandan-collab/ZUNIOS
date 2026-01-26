"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationManager() {
    useEffect(() => {
        // 1. Request Permission on Mount
        const requestPermission = async () => {
            if (!("Notification" in window)) return;
            if (Notification.permission === "default") {
                await Notification.requestPermission();
            }
        };

        requestPermission();

        // 2. Check Logic Loop
        const checkPulse = () => {
            const now = new Date();
            const hour = now.getHours();
            const dateStr = now.toLocaleDateString();

            // Morning Pulse (6 AM - 10 AM)
            if (hour >= 6 && hour < 10) {
                const lastMorning = localStorage.getItem("kogito_last_morning_pulse");
                if (lastMorning !== dateStr) {
                    sendPulse("Morning Intent", "What is your main focus today?", "🌞");
                    localStorage.setItem("kogito_last_morning_pulse", dateStr);
                }
            }

            // Evening Pulse (8 PM - 11 PM)
            if (hour >= 20 && hour < 23) {
                const lastEvening = localStorage.getItem("kogito_last_evening_pulse");
                if (lastEvening !== dateStr) {
                    sendPulse("Evening Reflection", "How did you close your loops today?", "🌙");
                    localStorage.setItem("kogito_last_evening_pulse", dateStr);
                }
            }
        };

        // Helper to send both Toast and System Notification
        const sendPulse = (title: string, body: string, icon: string) => {
            // In-app Toast
            toast(title, {
                description: body,
                icon: icon,
                duration: 8000,
                action: {
                    label: "Write",
                    onClick: () => {
                        const input = document.querySelector('input');
                        if (input) input.focus();
                    }
                }
            });

            // System Notification (if permitted and hidden)
            if (document.visibilityState === "hidden" && Notification.permission === "granted") {
                new Notification(`Kogito: ${title}`, {
                    body: body,
                    icon: "/icon-192x192.png" // Assuming standard PWA icon
                });
            }
        };

        // Run immediately and then every minute
        checkPulse();
        const interval = setInterval(checkPulse, 60000);

        return () => clearInterval(interval);
    }, []);

    return null; // Headless component
}
