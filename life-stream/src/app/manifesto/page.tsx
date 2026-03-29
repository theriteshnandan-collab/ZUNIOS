"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { User, Compass, Star, Share2, Edit2, Save, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import ZuniosLogo from "@/components/ZuniosLogo";

// Default "Seed" Manifesto
const DEFAULT_MANIFESTO = {
    northStar: "To build a legacy that outlives my code.",
    values: [
        { id: 1, title: "Velocity", desc: "Speed is the currency of the future." },
        { id: 2, title: "Clarity", desc: "In a noisy world, silence is power." },
        { id: 3, title: "Impact", desc: "Do not just exist. Change the state." }
    ],
    bio: "Architect of the Digital Void."
};

export default function ManifestoPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [manifesto, setManifesto] = useState(DEFAULT_MANIFESTO);
    const [loading, setLoading] = useState(true);

    // Deep Parallax Environment
    const { scrollYProgress } = useScroll();
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
    const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);

    // Load from Storage
    useEffect(() => {
        const saved = localStorage.getItem("zunios_manifesto");
        if (saved) {
            setManifesto(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    const handleSave = () => {
        localStorage.setItem("zunios_manifesto", JSON.stringify(manifesto));
        setIsEditing(false);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success("Manifesto Etched into Core Memory");
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-[#080808] text-white overflow-hidden relative selection:bg-white/20">
            {/* 🌌 Background Atmosphere (Hardware Void) */}
            <motion.div style={{ scale: bgScale, y: bgY }} className="fixed inset-0 pointer-events-none transform-gpu origin-top">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/[0.05] to-transparent opacity-80" />
                <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full blur-[150px]" />
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            </motion.div>

            <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">

                {/* Header Actions */}
                <div className="flex justify-between items-center mb-16">
                    <ZuniosLogo size="sm" showText={true} />
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(!isEditing)}
                            className="hover:bg-white/10 text-white/50 hover:text-white"
                        >
                            {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
                            onClick={() => toast.info("Sharing capability coming in Sub-Phase C.2")}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Identity
                        </Button>
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-24"
                >
                    {/* 🌟 Section 1: The North Star */}
                    <motion.div variants={item} className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs font-medium uppercase tracking-widest">
                            <Compass className="w-3 h-3" />
                            North Star
                        </div>

                        <AnimatePresence mode="popLayout" initial={false}>
                            {isEditing ? (
                                <motion.div layoutId="manifesto-core" key="edit" className="relative max-w-4xl mx-auto">
                                    <Textarea
                                        value={manifesto.northStar}
                                        onChange={(e) => setManifesto({ ...manifesto, northStar: e.target.value })}
                                        className="text-4xl md:text-6xl font-serif text-center bg-black/40 border border-white/10 focus:border-cyan-500/50 min-h-[200px] rounded-3xl p-8 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] backdrop-blur-xl"
                                    />
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl" />
                                </motion.div>
                            ) : (
                                <motion.h1 layoutId="manifesto-core" key="view" className="text-5xl md:text-7xl font-serif font-medium leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 tracking-tight relative z-10 w-full inline-block">
                                    "{manifesto.northStar}"
                                </motion.h1>
                            )}
                        </AnimatePresence>

                        <p className="text-white/40 text-sm tracking-widest uppercase items-center justify-center flex gap-2">
                            — {manifesto.bio}
                        </p>
                    </motion.div>


                    {/* 💎 Section 2: Core Values (The Code) */}
                    <div className="grid md:grid-cols-3 gap-6 relative z-10 w-full">
                        {manifesto.values.map((val, idx) => (
                            <ParallaxValueCard key={val.id} val={val} idx={idx} />
                        ))}
                    </div>

                    {/* 📜 Section 3: The Signature */}
                    <motion.div variants={item} className="text-center pt-12">
                        <Quote className="w-8 h-8 text-white/20 mx-auto mb-6" />
                        <p className="text-lg text-white/60 italic max-w-2xl mx-auto">
                            This is the operating system of my life. <br />
                            Signed and sealed on the Blockchain of Reality.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}

// God-Tier Parallax Card 
function ParallaxValueCard({ val, idx }: { val: { id: number, title: string, desc: string }, idx: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        // Slide up elegantly as it enters the viewport
        offset: ["start 100%", "center 80%"]
    });

    // Stagger based on index using hardware math offsets
    const y = useTransform(scrollYProgress, [0, 1], [60 + (idx * 20), 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

    return (
        <motion.div 
            ref={ref} 
            style={{ y, opacity, scale }} 
            className="transform-gpu will-change-transform relative group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/5 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay rounded-3xl z-0" />

            <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-cyan-400 transition-colors duration-500 relative z-10 tracking-tight">
                {val.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed relative z-10 font-light">
                {val.desc}
            </p>

            {/* Decorative Number */}
            <div className="absolute bottom-6 right-8 text-6xl font-serif text-white/5 pointer-events-none transition-colors duration-700 group-hover:text-cyan-400/10">
                0{idx + 1}
            </div>
        </motion.div>
    );
}
