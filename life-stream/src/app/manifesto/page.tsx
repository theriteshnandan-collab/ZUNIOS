"use client";

import { useState, useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionTemplate,
    AnimatePresence,
    useInView,
    MotionValue,
} from "framer-motion";
import { Edit2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ZuniosLogo from "@/components/ZuniosLogo";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DEFAULT_MANIFESTO = {
    northStar: "The mind is not a vessel to fill. It is an engine to ignite.",
    values: [
        { id: 1, num: "01", title: "Silence", desc: "Most systems scream. Ours listens." },
        { id: 2, num: "02", title: "Precision", desc: "One signal. No noise. No compromise." },
        { id: 3, num: "03", title: "Momentum", desc: "Every log is a push against entropy." },
        { id: 4, num: "04", title: "Sovereignty", desc: "You are the algorithm." },
    ],
};

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

// ─── VECTOR FIELD CANVAS ──────────────────────────────────────────────────────
// Full-page magnetic field visualization — dashes radiate away from cursor

function VectorFieldCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    const COLS = 28;
    const ROWS = 22;
    const DASH_LEN = 14;
    const LINE_WEIGHT = 1;
    const OPACITY_BASE = 0;
    const OPACITY_HOT = 0.8;
    const INFLUENCE_RADIUS = 380;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY + window.scrollY,
            };
        };
        window.addEventListener("mousemove", onMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cw = canvas.width;
            const ch = canvas.height;
            const gapX = cw / COLS;
            const gapY = ch / ROWS;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (let col = 0; col < COLS; col++) {
                for (let row = 0; row < ROWS; row++) {
                    const px = gapX * col + gapX / 2;
                    const py = gapY * row + gapY / 2;

                    const dx = px - mx;
                    const dy = py - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // angle from mouse → point (radiate away)
                    const angle = Math.atan2(dy, dx);

                    // proximity influence 0..1
                    const influence = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
                    const opacity = OPACITY_BASE + influence * (OPACITY_HOT - OPACITY_BASE);
                    const len = DASH_LEN + influence * 6;

                    const hx = Math.cos(angle) * len / 2;
                    const hy = Math.sin(angle) * len / 2;

                    ctx.beginPath();
                    ctx.moveTo(px - hx, py - hy);
                    ctx.lineTo(px + hx, py + hy);
                    ctx.strokeStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
                    ctx.lineWidth = LINE_WEIGHT;
                    ctx.lineCap = "round";
                    ctx.stroke();
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            aria-hidden
        />
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ManifestoPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [manifesto, setManifesto] = useState(DEFAULT_MANIFESTO);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: mounted ? containerRef : undefined,
        offset: ["start start", "end end"],
    });

    // Hero parallax
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.88]);
    const heroBlurPx = useTransform(scrollYProgress, [0, 0.1], [0, 14]);
    const heroFilter = useMotionTemplate`blur(${heroBlurPx}px)`;

    useEffect(() => {
        const saved = localStorage.getItem("zunios_manifesto_v4");
        if (saved) setManifesto(JSON.parse(saved));
        setLoading(false);
        setMounted(true);
    }, []);

    const handleSave = () => {
        localStorage.setItem("zunios_manifesto_v4", JSON.stringify(manifesto));
        setIsEditing(false);
        toast.success("Matrix committed.", {
            className:
                "bg-black border border-white/10 text-white font-mono uppercase text-[10px] tracking-widest",
        });
    };

    if (loading) return <div className="min-h-screen bg-[#080808]" />;

    return (
        <div ref={containerRef} className="bg-[#080808] text-white selection:bg-white/20 selection:text-black overflow-x-hidden">

            {/* ── Magnetic vector field (full page) ─────────────────────── */}
            <VectorFieldCanvas />

            <main className="relative z-10 w-full">

                {/* ── Sticky Nav ─────────────────────────────────────────── */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-5">
                        <Link
                            href="/journal"
                            className="group flex items-center gap-2 text-[#9F9F9F] hover:text-white transition-colors duration-300"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.4em]">Core</span>
                        </Link>
                        <div className="h-3.5 w-px bg-white/10" />
                        <ZuniosLogo size="sm" showText={false} />
                    </div>

                    <button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className="flex items-center gap-2 text-[#9F9F9F] hover:text-white transition-colors duration-300 text-[9px] font-mono uppercase tracking-[0.3em]"
                    >
                        {isEditing
                            ? <><Save className="w-3 h-3" /> Commit</>
                            : <><Edit2 className="w-3 h-3" /> Edit</>
                        }
                    </button>
                </nav>

                {/* ══════════════════════════════════════════════════════════
                    § 1  THE VOID HERO
                ══════════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        style={{
                            opacity: heroOpacity,
                            scale: heroScale,
                            filter: heroFilter,
                        }}
                        className="w-full max-w-5xl mx-auto"
                    >
                        {/* Eyebrow label */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: EXPO_OUT, delay: 0.1 }}
                            className="text-[9px] font-mono text-[#9F9F9F] uppercase tracking-[0.65em] mb-14"
                        >
                            ZUNIOS — MANIFESTO — 001
                        </motion.p>

                        {/* North Star quote */}
                        <HeroTitle
                            text={manifesto.northStar}
                            isEditing={isEditing}
                            onChange={(v) => setManifesto({ ...manifesto, northStar: v })}
                        />

                        {/* Animated scroll whisper */}
                        <motion.div
                            animate={{ opacity: [0, 0.35, 0], y: [0, 8, 0] }}
                            transition={{ duration: 2.8, repeat: Infinity, delay: 2.8, ease: "easeInOut" }}
                            className="mt-20 flex justify-center"
                        >
                            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    § 2  THE STACK
                ══════════════════════════════════════════════════════════ */}
                <GlassDeckSection
                    manifesto={manifesto}
                    isEditing={isEditing}
                    onUpdate={(idx: number, title: string, desc: string) => {
                        const newValues = [...manifesto.values];
                        newValues[idx] = { ...newValues[idx], title, desc };
                        setManifesto({ ...manifesto, values: newValues });
                    }}
                />

                {/* ══════════════════════════════════════════════════════════
                    § 3  THE SEAL
                ══════════════════════════════════════════════════════════ */}
                <TheSeal />
            </main>
        </div>
    );
}

// ─── HERO TITLE ───────────────────────────────────────────────────────────────

function HeroTitle({
    text,
    isEditing,
    onChange,
}: {
    text: string;
    isEditing: boolean;
    onChange: (v: string) => void;
}) {
    if (isEditing) {
        return (
            <textarea
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-5xl md:text-7xl font-serif text-center bg-transparent border-0 focus:ring-0 focus-visible:ring-0 text-white min-h-[220px] leading-tight resize-none outline-none"
                placeholder="State your North Star..."
            />
        );
    }

    const words = text.split(" ");
    return (
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.15] tracking-tight text-white">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 60, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        type: "spring",
                        stiffness: 55,
                        damping: 18,
                        delay: 0.4 + i * 0.07,
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </h1>
    );
}

// ─── GLASS DECK SECTION ───────────────────────────────────────────────────────

function GlassDeckSection({
    manifesto,
    isEditing,
    onUpdate,
}: {
    manifesto: typeof DEFAULT_MANIFESTO;
    isEditing: boolean;
    onUpdate: (idx: number, title: string, desc: string) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const { scrollYProgress } = useScroll({
        target: mounted ? containerRef : undefined,
        offset: ["start start", "end end"],
    });

    return (
        <section ref={containerRef} className="relative w-full h-[400vh]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none px-6 md:px-20">
                {manifesto.values.map((val, idx) => (
                    <GlassDeckCard
                        key={val.id}
                        val={val}
                        idx={idx}
                        total={manifesto.values.length}
                        isLast={idx === manifesto.values.length - 1}
                        scrollYProgress={scrollYProgress}
                        isEditing={isEditing}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        </section>
    );
}

// ─── GLASS DECK CARD ──────────────────────────────────────────────────────────

function GlassDeckCard({
    val,
    idx,
    total,
    isLast,
    scrollYProgress,
    isEditing,
    onUpdate,
}: {
    val: (typeof DEFAULT_MANIFESTO.values)[0];
    idx: number;
    total: number;
    isLast: boolean;
    scrollYProgress: MotionValue<number>;
    isEditing: boolean;
    onUpdate: (idx: number, title: string, desc: string) => void;
}) {
    const enterStart = (idx / total) * 0.8;
    const enterEnd = enterStart + 0.18;

    const y = useTransform(
        scrollYProgress,
        [0, enterStart, enterEnd, 1],
        [120, 120, 0, isLast ? 0 : -80]
    );
    const scale = useTransform(
        scrollYProgress,
        [0, enterEnd, 1],
        [1, 1, isLast ? 1 : 0.93]
    );
    const rotateX = useTransform(
        scrollYProgress,
        [0, enterStart, enterEnd, 1],
        [15, 15, 0, isLast ? 0 : -3]
    );
    // Use MotionTemplate for filter — no .get() in render
    const blurPx = useTransform(
        scrollYProgress,
        [0, enterEnd, isLast ? 2 : enterEnd + 0.1, 1],
        [0, 0, isLast ? 0 : 5, isLast ? 0 : 7]
    );
    const cardFilter = useMotionTemplate`blur(${blurPx}px)`;

    const opacity = isLast
        ? useTransform(scrollYProgress, [0, enterStart, enterEnd], [0, 0, 1])
        : useTransform(scrollYProgress, [0, enterStart, enterEnd, enterEnd + 0.07], [0, 0, 1, 0]);

    return (
        <motion.div
            style={{ y, scale, rotateX, opacity, filter: cardFilter, perspective: 1200, zIndex: idx * 10 }}
            className="absolute w-full max-w-4xl pointer-events-auto"
        >
            <ValueCard
                val={val}
                idx={idx}
                isEditing={isEditing}
                onUpdate={(title, desc) => onUpdate(idx, title, desc)}
            />
        </motion.div>
    );
}

// ─── VALUE CARD ───────────────────────────────────────────────────────────────

function ValueCard({
    val,
    idx,
    isEditing,
    onUpdate,
}: {
    val: (typeof DEFAULT_MANIFESTO.values)[0];
    idx: number;
    isEditing: boolean;
    onUpdate: (title: string, desc: string) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div
            ref={ref}
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#080808] p-12 md:p-16 group"
            style={{ boxShadow: "0 60px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
            {/* BorderBreath */}
            <motion.div
                className="absolute inset-0 rounded-[2rem] pointer-events-none"
                animate={{
                    boxShadow: [
                        "inset 0 0 0 1px rgba(255,255,255,0.07)",
                        "inset 0 0 0 1px rgba(255,255,255,0.22)",
                        "inset 0 0 0 1px rgba(255,255,255,0.07)",
                    ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.7 }}
            />

            {/* SilverSweep — one-shot diagonal shimmer on entrance */}
            {inView && (
                <motion.div
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{ duration: 1.0, ease: EXPO_OUT, delay: 0.05 }}
                    className="absolute inset-y-0 w-2/3 pointer-events-none"
                    style={{
                        background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.055) 50%, transparent 75%)",
                        zIndex: 5,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                <p className="text-[10px] font-mono text-[#9F9F9F]/40 tracking-[0.55em] mb-10 select-none">
                    {val.num}
                </p>

                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            value={val.title}
                            onChange={(e) => onUpdate(e.target.value, val.desc)}
                            className="w-full bg-transparent border-b border-white/20 text-white font-serif text-5xl md:text-6xl focus:outline-none focus:border-white/40 pb-2 transition-colors"
                        />
                        <textarea
                            value={val.desc}
                            onChange={(e) => onUpdate(val.title, e.target.value)}
                            className="w-full bg-transparent text-[#9F9F9F] text-xl focus:outline-none h-20 resize-none"
                        />
                    </div>
                ) : (
                    <>
                        <h2 className="text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-white leading-[1.05] mb-6">
                            {val.title}
                        </h2>
                        <div className="w-8 h-px bg-white/15 mb-6" />
                        <p className="text-[#9F9F9F] text-xl md:text-2xl font-light leading-relaxed max-w-lg tracking-wide">
                            {val.desc}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── THE SEAL ─────────────────────────────────────────────────────────────────

function TheSeal() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: false, margin: "-25%" });

    return (
        <section ref={ref} className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <AnimatePresence>
                {inView && (
                    <motion.div
                        key="seal"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.3, ease: EXPO_OUT }}
                        className="flex flex-col items-center gap-8"
                    >
                        {/* VoidPulse */}
                        <motion.div
                            animate={{ scale: [1, 1.8, 1], opacity: [0.9, 0.1, 0.9] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 h-2 rounded-full bg-white"
                        />
                        <div className="w-20 h-px bg-white/10" />
                        <p className="text-[9px] font-mono text-[#9F9F9F] uppercase tracking-[0.65em] leading-loose">
                            ZUNIOS — OS FOR THE HUMAN MIND
                            <br />
                            EST. 2025 · NODE: NEURAL-CORE-001
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
