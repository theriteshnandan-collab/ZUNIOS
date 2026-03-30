"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticleBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export const ParticleBackground = ({ className, children }: ParticleBackgroundProps) => {
    const particleRef = useRef<HTMLCanvasElement>(null);
    const vectorRef   = useRef<HTMLCanvasElement>(null);

    // ── Floating particle web ──────────────────────────────────────────────────
    useEffect(() => {
        const canvas = particleRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
        const particleCount = 180;
        const connectionDistance = 120;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const init = () => {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x:      Math.random() * canvas.width,
                    y:      Math.random() * canvas.height,
                    vx:     (Math.random() - 0.5) * 0.3,
                    vy:     (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                });
            }
        };

        let raf: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${0.35 + Math.random() * 0.15})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2   = particles[j];
                    const dx   = p.x - p2.x;
                    const dy   = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(180,180,180,${0.12 * (1 - dist / connectionDistance)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        init();
        animate();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);

    // ── Magnetic vector field ─────────────────────────────────────────────────
    useEffect(() => {
        const canvas = vectorRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        // generous grid — 40 cols × 30 rows = 1200 dashes
        const COLS           = 40;
        const ROWS           = 30;
        const DASH_LEN       = 13;
        const LINE_WEIGHT    = 1.1;
        const BASE           = 0;
        const HOT            = 0.70;
        const INFLUENCE_RADIUS = 350;

        const mouse = { x: -9999, y: -9999 };
        let raf: number;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        window.addEventListener("mousemove", onMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gapX = canvas.width  / COLS;
            const gapY = canvas.height / ROWS;

            for (let col = 0; col < COLS; col++) {
                for (let row = 0; row < ROWS; row++) {
                    const px = gapX * col + gapX / 2;
                    const py = gapY * row + gapY / 2;

                    const dx   = px - mouse.x;
                    const dy   = py - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Angle radiating AWAY from cursor
                    const angle     = Math.atan2(dy, dx);
                    const influence = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
                    const opacity   = BASE + influence * (HOT - BASE);
                    const len       = DASH_LEN + influence * 8;

                    const hx = Math.cos(angle) * len / 2;
                    const hy = Math.sin(angle) * len / 2;

                    ctx.beginPath();
                    ctx.moveTo(px - hx, py - hy);
                    ctx.lineTo(px + hx, py + hy);
                    ctx.strokeStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
                    ctx.lineWidth   = LINE_WEIGHT;
                    ctx.lineCap     = "round";
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
    }, []);

    return (
        <div className={cn("relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden", className)}>
            {/* Deep Space Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080808] to-[#0f0f0f] pointer-events-none" />

            {/* Particle web */}
            <canvas ref={particleRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />

            {/* Magnetic vector field */}
            <canvas ref={vectorRef} className="absolute inset-0 z-[1] pointer-events-none" />

            {/* Vignette */}
            <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};
