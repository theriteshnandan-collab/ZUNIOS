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
        let raf: number;

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
        };
        window.addEventListener("mousemove", onMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gx = canvas.width  / COLS;
            const gy = canvas.height / ROWS;

            for (let c = 0; c < COLS; c++) {
                for (let r = 0; r < ROWS; r++) {
                    const px = gx * c + gx / 2;
                    const py = gy * r + gy / 2;

                    const dx  = px - mouse.x;
                    const dy  = py - mouse.y;
                    const d   = Math.sqrt(dx * dx + dy * dy);
                    const ang = Math.atan2(dy, dx);
                    const inf = Math.max(0, 1 - d / RAD);
                    const op  = BASE + inf * (HOT - BASE);
                    const len = DASH + inf * 10;

                    const hx = Math.cos(ang) * len / 2;
                    const hy = Math.sin(ang) * len / 2;

                    ctx.beginPath();
                    ctx.moveTo(px - hx, py - hy);
                    ctx.lineTo(px + hx, py + hy);
                    ctx.strokeStyle = `rgba(255,255,255,${op.toFixed(3)})`;
                    ctx.lineWidth   = W;
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
            <section className="relative py-40 flex items-center justify-center overflow-hidden bg-black">

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

                    <p className="text-lg md:text-xl text-white/40 font-serif leading-relaxed max-w-xl mx-auto italic">
                        &ldquo;I think, therefore I am. Your thoughts create your reality. Zunios helps you master them.&rdquo;
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
                            <p className="text-sm text-white/30 leading-relaxed max-w-[260px]">
                                The operating system for your consciousness. Think deeper, live sharper.
                            </p>
                            {/* Social row */}
                            <div className="flex items-center gap-3 pt-2">
                                <Link href="https://x.com/zunioscodes" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] hover:border-white/25 transition-all group">
                                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                </Link>
                                <Link href="mailto:zunios.codes@gmail.com" className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.12] hover:border-white/25 transition-all group">
                                    <Mail className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-5">
                            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.25em]">Explore</h3>
                            <ul className="space-y-3">
                                {[
                                    { label: "New Entry", href: "/" },
                                    { label: "Memory Bank", href: "/journal" },
                                    { label: "Tasks", href: "/tasks" },
                                    { label: "North Star", href: "/manifesto" },
                                ].map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-white/30 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                                            {link.label}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Status */}
                        <div className="space-y-5">
                            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.25em]">System</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                                    <span className="text-sm text-white/40">All Systems Operational</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-white/30" />
                                    <span className="text-sm text-white/30">v2.0 Beta</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-white/20" />
                                    <span className="text-sm text-white/25">Edge Runtime</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/20">&copy; 2026 Zunios Systems. All rights reserved.</p>
                        <p className="text-xs text-white/20 flex items-center gap-1.5">
                            Made with <Heart className="w-3 h-3 text-white/50 fill-white/50 inline" /> by <span className="text-white/40 font-medium">Zunios Team</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
