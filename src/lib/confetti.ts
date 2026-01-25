// Confetti celebration utilities
// Triggers celebratory confetti for achievements

"use client";

import confetti from 'canvas-confetti';

/**
 * Basic confetti burst
 */
export function celebrateSuccess() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

/**
 * Task completion confetti (subtle)
 */
export function celebrateTaskComplete() {
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.9, y: 0.9 }, // Bottom right where FAB is
        colors: ['#8B5CF6', '#EC4899', '#10B981'] // Purple, pink, green
    });
}

/**
 * Streak milestone confetti (exciting)
 */
export function celebrateStreak(days: number) {
    const count = Math.min(days * 20, 200);

    // Fire confetti from both sides
    confetti({
        particleCount: count / 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B35', '#F7931E', '#FFD23F'] // Fire colors
    });

    confetti({
        particleCount: count / 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B35', '#F7931E', '#FFD23F']
    });
}

/**
 * Badge earned confetti (special)
 */
export function celebrateBadge() {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 3,
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#8B5CF6']
        });
    }, 50);
}

/**
 * First entry celebration
 */
export function celebrateFirstEntry() {
    const scalar = 2;
    const emoji = confetti.shapeFromText({ text: '🎉', scalar });

    confetti({
        shapes: [emoji],
        scalar,
        particleCount: 20,
        spread: 100,
        origin: { y: 0.5 }
    });

    // Follow up with regular confetti
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, 300);
}
