"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        <div className="min-h-screen bg-[#050510] text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* 🌌 Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[120px]" />
            </div>

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

                        {isEditing ? (
                            <Textarea
                                value={manifesto.northStar}
                                onChange={(e) => setManifesto({ ...manifesto, northStar: e.target.value })}
                                className="text-4xl md:text-6xl font-serif text-center bg-transparent border-white/10 focus:border-amber-500/50 min-h-[200px]"
                            />
                        ) : (
                            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                                "{manifesto.northStar}"
                            </h1>
                        )}

                        <p className="text-white/40 text-sm tracking-widest uppercase items-center justify-center flex gap-2">
                            — {manifesto.bio}
                        </p>
                    </motion.div>


                    {/* 💎 Section 2: Core Values (The Code) */}
                    <motion.div variants={item} className="grid md:grid-cols-3 gap-6">
                        {manifesto.values.map((val, idx) => (
                            <div key={val.id} className="relative group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-105">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <h3 className="text-xl font-medium mb-3 text-white/90 group-hover:text-amber-200 transition-colors">
                                    {val.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    {val.desc}
                                </p>

                                {/* Decorative Number */}
                                <div className="absolute bottom-6 right-8 text-6xl font-serif text-white/5 pointer-events-none">
                                    0{idx + 1}
                                </div>
                            </div>
                        ))}
                    </motion.div>

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
