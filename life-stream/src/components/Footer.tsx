"use client";

import Link from "next/link";
import { Mail, Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import ZuniosLogo from "@/components/ZuniosLogo";
import { useRef, useEffect } from "react";

function CogitoBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const COLS = 44;
        const ROWS = 20;
        const DASH = 15;
        const W    = 1.2;
        const BASE = 0;
        const HOT  = 0.75;
        const RAD  = 380;

        const mouse = { x: -9999, y: -9999 };
        let isMouseIn = false;
        let raf: number;
        let tick = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width  = rect.width;
            canvas.height = rect.height;
        };
        resize();

        const onResize = () => resize();
        window.addEventListener("resize", onResize);

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            isMouseIn = true;
        };
        const onLeave = () => {
            isMouseIn = false;
        };
        window.addEventListener("mousemove", onMove);
        canvas.addEventListener("mouseleave", onLeave);

        const draw = () => {
            tick += 0.85;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gx = canvas.width  / COLS;
            const gy = canvas.height / ROWS;

            // ─── PROGRAMMED GHOST ATTRACTOR ─────────────────────────────────────
            const ghostX = (tick * 4) % (canvas.width + 1200) - 600;
            const ghostY = canvas.height / 2;

            for (let c = 0; c < COLS; c++) {
                for (let r = 0; r < ROWS; r++) {
                    const px = gx * c + gx / 2;
                    const py = gy * r + gy / 2;

                    // 1. Calculate REAL Mouse Influence
                    const rdx  = px - mouse.x;
                    const rdy  = py - mouse.y;
                    const rd   = Math.sqrt(rdx * rdx + rdy * rdy);
                    const realInf = Math.max(0, 1 - rd / RAD);
                    const realAng = Math.atan2(rdy, rdx);

                    // 2. Calculate GHOST Attractor Influence (Autonomous)
                    // CRITICAL: Ghost influence is ZERO if the real mouse is present
                    const gdx  = px - ghostX;
                    const Gdy  = py - ghostY;
                    const gd   = Math.sqrt(gdx * gdx + Gdy * Gdy);
                    const ghostInf = isMouseIn ? 0 : Math.max(0, 1 - gd / (RAD * 1.2));
                    const ghostAng = Math.atan2(Gdy, gdx);

                    // 3. Final Orientation Selection
                    const totalInf = Math.max(realInf, ghostInf);
                    const finalAng = isMouseIn ? realAng : ghostAng;

                    // 4. Visual Intensity Logic
                    const baseOp = BASE + totalInf * (HOT - BASE);
                    const finalOp = Math.min(0.75, baseOp + (ghostInf * 0.08));

                    const len = DASH + totalInf * 14;
                    const hx  = Math.cos(finalAng) * len / 2;
                    const hy  = Math.sin(finalAng) * len / 2;

                    ctx.beginPath();
                    ctx.moveTo(px - hx, py - hy);
                    ctx.lineTo(px + hx, py + hy);
                    ctx.strokeStyle = `rgba(255,255,255,${finalOp.toFixed(3)})`;
                    ctx.lineWidth   = W + (totalInf * 0.4);
                    ctx.lineCap     = "round";
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMove);
            canvas.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden
        />
    );
}

export default function Footer() {
    return (
        <footer className="relative w-full hidden md:block overflow-hidden bg-black">

            {/* ══════ CINEMATIC CLOSING — "Cogito" ══════ */}
            <section className="relative py-24 md:py-36 flex items-center justify-center overflow-hidden bg-black">

                {/* Magnetic vector field — covers full section bg */}
                <CogitoBg />

                {/* Radial glow behind text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
                    <div className="w-[700px] h-[400px] rounded-full bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent blur-[100px]" />
                </div>

                {/* Corner brackets */}
                <div className="absolute top-12 left-12 w-10 h-10 border-t border-l border-white/15 pointer-events-none z-[3]" />
                <div className="absolute top-12 right-12 w-10 h-10 border-t border-r border-white/15 pointer-events-none z-[3]" />
                <div className="absolute bottom-12 left-12 w-10 h-10 border-b border-l border-white/15 pointer-events-none z-[3]" />
                <div className="absolute bottom-12 right-12 w-10 h-10 border-b border-r border-white/15 pointer-events-none z-[3]" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-8"
                >
                    {/* Decorative top line */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            Cogito, Ergo Sum
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white font-serif leading-relaxed max-w-xl mx-auto italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        &ldquo;I think, therefore I am. Master your mind. Shape your reality.&rdquo;
                    </p>

                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mx-auto" />

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Link
                            href="/#titan-input"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 group"
                        >
                            Begin Your Journey
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ══════ MAIN FOOTER ══════ */}
            <div className="relative border-t border-white/[0.08] bg-black">
                {/* Top shine */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="container mx-auto max-w-5xl px-8 py-16">
                    <div className="grid md:grid-cols-3 gap-12 items-start">

                        {/* Brand */}
                        <div className="space-y-5">
                            <Link href="/" className="inline-flex items-center gap-2 group">
                                <ZuniosLogo size="sm" showText={true} />
                            </Link>
                            <p className="text-sm text-white/90 leading-relaxed max-w-[260px] font-medium">
                                Master your mind. Shape your reality.
                            </p>
                            {/* Social row */}
                            <div className="flex items-center gap-3 pt-2">
                                <Link href="https://x.com/zunioscodes" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.1] border border-white/[0.2] flex items-center justify-center hover:bg-white/[0.2] hover:border-white/[0.4] transition-all duration-300 group shadow-lg">
                                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white group-hover:text-white transition-colors duration-300" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                </Link>
                                <Link href="mailto:zunios.codes@gmail.com" className="w-9 h-9 rounded-full bg-white/[0.1] border border-white/[0.2] flex items-center justify-center hover:bg-white/[0.2] hover:border-white/[0.4] transition-all duration-300 group shadow-lg">
                                    <Mail className="w-3.5 h-3.5 text-white group-hover:text-white transition-colors duration-300" />
                                </Link>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.35em]">Explore</h3>
                            <ul className="space-y-3">
                                {[
                                    { label: "New Entry", href: "/" },
                                    { label: "Memory Bank", href: "/journal" },
                                    { label: "Tasks", href: "/tasks" },
                                    { label: "North Star", href: "/manifesto" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group font-medium">
                                            {link.label}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Status */}
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.35em]">System</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                                    <span className="text-sm text-white font-bold tracking-tight">All Systems Operational</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                    <span className="text-sm text-white font-medium">v2.0</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-white/80" />
                                    <span className="text-sm text-white font-medium">Edge Runtime</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-16 pt-8 border-t border-white/[0.1] flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10 rounded-t-lg" />
                        <p className="text-xs text-white/60">&copy; {new Date().getFullYear()} Zunios Systems. All rights reserved.</p>
                        <p className="text-xs text-white/60 flex items-center gap-1.5">
                            Made with <Heart className="w-3 h-3 text-white/80 fill-white/50 inline" /> by <span className="text-white/80 font-medium">Zunios Team</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
