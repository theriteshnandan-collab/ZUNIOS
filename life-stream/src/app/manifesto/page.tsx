"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Compass, Edit2, Save, Share2, Quote, ArrowLeft, Terminal, Shield, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import ZuniosLogo from "@/components/ZuniosLogo";

const DEFAULT_MANIFESTO = {
    northStar: "To architect systems that transcend biological limitations.",
    values: [
        { id: 1, title: "Singularity", desc: "One mind, perfectly synchronized with the machine.", icon: Zap },
        { id: 2, title: "Precision", desc: "Removing the friction of human error from every cycle.", icon: Shield },
        { id: 3, title: "Observation", desc: "Witnessing the data stream without judgment.", icon: Eye },
        { id: 4, title: "Sovereignty", desc: "The user is the kernel; all external noise is a background process.", icon: Shield },
        { id: 5, title: "Fluidity", desc: "Adapting the interface to the frequency of thought.", icon: Zap },
        { id: 6, title: "Ascension", desc: "Beyond data logging—into the realm of pure intuition.", icon: Compass }
    ],
    bio: "System Architect // Neural Void Operator"
};

export default function ManifestoPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [manifesto, setManifesto] = useState(DEFAULT_MANIFESTO);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Deep Monochrome Parallax Transforms
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.6], [1, 1, 0.2, 0]);
    const headerScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.6]);

    useEffect(() => {
        const saved = localStorage.getItem("zunios_manifesto_v2");
        if (saved) {
            setManifesto(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    const handleSave = () => {
        localStorage.setItem("zunios_manifesto_v2", JSON.stringify(manifesto));
        setIsEditing(false);
        toast.success("Identity Matrix Updated", {
            className: "bg-black border border-white/20 text-white font-mono uppercase text-xs tracking-widest"
        });
    };

    if (loading) return <motion.div ref={containerRef} className="min-h-screen bg-black" />;

    return (
        <motion.div ref={containerRef} className="min-h-[200vh] bg-[#050505] text-white selection:bg-white/30 selection:text-black">
            {/* 🌑 Deep Void Environment */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div style={{ y: bgY }} className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[120px]" />
                </motion.div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6">
                {/* 🏷️ Navigation Terminal */}
                <nav className="sticky top-0 pt-8 pb-4 flex justify-between items-center backdrop-blur-sm z-50">
                    <div className="flex items-center gap-6">
                        <Link href="/journal" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Core</span>
                        </Link>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <ZuniosLogo size="sm" showText={true} />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.2em] px-6 rounded-full h-10 transition-all active:scale-95"
                        >
                            {isEditing ? (
                                <><Save className="w-3.5 h-3.5 mr-2" /> Commit Changes</>
                            ) : (
                                <><Edit2 className="w-3.5 h-3.5 mr-2" /> Modify Matrix</>
                            )}
                        </Button>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 bg-transparent hover:bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] px-6 rounded-full h-10"
                            >
                                <Share2 className="w-3.5 h-3.5 mr-2" /> Protocol Share
                            </Button>
                        )}
                    </div>
                </nav>

                {/* 📜 Editorial Header (The North Star) */}
                <section className="min-h-[100vh] flex flex-col items-center justify-center text-center py-20">
                    <motion.div style={{ opacity: textOpacity, scale: headerScale }} className="w-full">
                        <div className="inline-flex items-center gap-2 mb-12 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                            <Compass className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Primary Vector: North Star</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="relative max-w-5xl mx-auto"
                                >
                                    <Textarea
                                        value={manifesto.northStar}
                                        onChange={(e) => setManifesto({ ...manifesto, northStar: e.target.value })}
                                        className="text-4xl md:text-7xl font-serif text-center bg-black/60 border-0 focus:ring-0 focus-visible:ring-0 min-h-[300px] leading-tight selection:bg-white/20 p-0"
                                        placeholder="Define your existence..."
                                    />
                                    <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-8" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="view"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="max-w-5xl mx-auto"
                                >
                                    <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] tracking-tight mb-12">
                                        <span className="italic block text-zinc-500 text-3xl md:text-5xl mb-6">"</span>
                                        {manifesto.northStar}
                                        <span className="italic block text-zinc-500 text-3xl md:text-5xl mt-6">"</span>
                                    </h1>
                                    
                                    <div className="flex items-center justify-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.5em]">
                                        <div className="w-12 h-[1px] bg-white/10" />
                                        <span>Authenticated: {manifesto.bio}</span>
                                        <div className="w-12 h-[1px] bg-white/10" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* 💎 Core Algorithm (Values) */}
                <section className="py-20 md:py-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-4 md:px-0 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                        {manifesto.values.map((val, idx) => (
                            <DeepValueCard 
                                key={val.id} 
                                val={val} 
                                idx={idx} 
                                isEditing={isEditing}
                                onUpdate={(title, desc) => {
                                    const newValues = [...manifesto.values];
                                    newValues[idx] = { ...newValues[idx], title, desc };
                                    setManifesto({ ...manifesto, values: newValues });
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* 📋 Directives Matrix */}
                <section className="py-20 md:py-40 border-t border-white/[0.03]">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="w-full md:w-1/3">
                            <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5" />
                                Primary Directives
                            </h2>
                            <p className="text-zinc-500 text-sm font-light leading-relaxed font-serif italic">
                                The underlying logic gates that govern every interaction within the Zunios environment. Non-negotiable protocols for the digital self.
                            </p>
                        </div>
                        <div className="w-full md:w-2/3 grid grid-cols-1 gap-4">
                            {[
                                "Protocol 01: Eliminate all non-essential cognitive load.",
                                "Protocol 02: Default to observation before execution.",
                                "Protocol 03: Maintain absolute hardware-software parity.",
                                "Protocol 04: Encrypt all subjective data within the Neural Void.",
                                "Protocol 05: Continuous self-optimization through recursive logs."
                            ].map((directive, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 border border-white/[0.03] rounded-xl hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                                    <span className="text-[10px] font-mono text-zinc-800 group-hover:text-zinc-400 transition-colors">DIR_{i + 1}</span>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">{directive}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-white animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 🏗️ System Architecture (Neural Nodes) */}
                <section className="py-20 md:py-40">
                    <div className="text-center mb-16">
                        <Shield className="w-6 h-6 text-white/10 mx-auto mb-4" />
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Neural Grid Topology</h2>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 max-w-4xl mx-auto opacity-40">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ scale: 1.5, backgroundColor: "rgba(255,255,255,0.4)", boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                                className="aspect-square bg-white/5 border border-white/10 rounded-sm transition-all duration-500"
                            />
                        ))}
                    </div>
                </section>

                {/* 🖋️ The Final Signature */}
                <section className="py-60 text-center border-t border-white/[0.03]">
                    <div className="max-w-xl mx-auto space-y-12">
                        <Quote className="w-10 h-10 text-white/10 mx-auto" />
                        <h2 className="text-3xl font-serif italic text-zinc-400 leading-relaxed">
                            "The code remains. Everything else is just noise in the machine."
                        </h2>
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Neural Fingerprint Verified</p>
                            <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
                            <p className="text-[8px] font-mono text-zinc-800">HASH: 0x7E3...A49 - BLOCK: 1774812 - NODE: ZUNIOS-CORE</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* ⌨️ Industrial Bio Input (Visible only in edit) */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm"
                    >
                        <div className="bg-zinc-900 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Terminal className="w-4 h-4 text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Subject Bio</span>
                            </div>
                            <input 
                                type="text"
                                value={manifesto.bio}
                                onChange={(e) => setManifesto({ ...manifesto, bio: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors font-mono"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function DeepValueCard({ val, idx, isEditing, onUpdate }: { 
    val: any, 
    idx: number, 
    isEditing: boolean,
    onUpdate: (title: string, desc: string) => void 
}) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
    const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 0]);

    const Icon = val.icon;

    return (
        <motion.div 
            ref={cardRef}
            style={{ rotateX, perspective: 1000 }}
            className="group relative p-8 md:p-12 bg-[#080808] transition-colors hover:bg-zinc-950 flex flex-col min-h-[350px] md:min-h-[420px] border-r border-b lg:border-b-0 last:border-r-0 border-white/[0.05]"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay group-hover:opacity-[0.1] transition-opacity" />
            
            <div className="mb-12 relative">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all duration-700">
                    <Icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors duration-700" />
                </div>
                {/* ID Counter */}
                <span className="absolute -top-3 -right-3 text-[10px] font-mono text-zinc-800">0{idx + 1}</span>
            </div>

            <motion.div style={{ y }} className="mt-auto space-y-6 relative z-10">
                {isEditing ? (
                    <div className="space-y-4">
                        <input 
                            value={val.title}
                            onChange={(e) => onUpdate(e.target.value, val.desc)}
                            className="w-full bg-transparent border-b border-white/10 text-white font-serif text-3xl focus:outline-none focus:border-white/40 pb-2"
                        />
                        <textarea 
                            value={val.desc}
                            onChange={(e) => onUpdate(val.title, e.target.value)}
                            className="w-full bg-transparent text-zinc-500 text-sm focus:outline-none min-h-[100px] resize-none leading-relaxed"
                        />
                    </div>
                ) : (
                    <>
                        <h3 className="text-4xl font-serif group-hover:italic transition-all duration-700">
                            {val.title}
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed font-light tracking-wide max-w-[240px]">
                            {val.desc}
                        </p>
                    </>
                )}
            </motion.div>

            {/* Edge Indicators */}
            <div className="absolute top-8 right-8 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="w-1 h-1 bg-white/20 rounded-full" />
            </div>

            {/* 🌍 Cinematic Overlays */}
            <motion.div className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <motion.div className="absolute inset-0 ring-1 ring-inset ring-white/[0.1] rounded-[16px] pointer-events-none z-30" />

            {/* Background Glow */}
            <motion.div 
                style={{ opacity: glowOpacity }}
                className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" 
            />
        </motion.div>
    );
}
