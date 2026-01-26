"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Zap } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-l-full pointer-events-none" />

            <div className="container mx-auto max-w-5xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                The Void Operating System
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Most journals are archives of the past. Zunios is an engine for your future.
                                We combined the ancient philosophy of <span className="text-primary italic">Sunya</span> (The Void)
                                with modern vector intelligence.
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: BrainCircuit,
                                    title: "Vector Memory",
                                    desc: "Zunios doesn't just store thoughts. It connects them. A dream from 2024 connects to an idea in 2026."
                                },
                                {
                                    icon: Zap,
                                    title: "Zero Friction",
                                    desc: "The Omni-Input is a void. No categories, no friction. Just pure consciousness capture."
                                },
                                {
                                    icon: Sparkles,
                                    title: "Active Intelligence",
                                    desc: "Unlike a static notebook, Zunios talks back. It analyzes patterns, suggests connections, and levels you up."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white text-lg">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-2xl blur-3xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
                            <div className="space-y-6 font-mono text-sm text-muted-foreground/80">
                                <div className="border-l-2 border-primary/50 pl-4">
                                    <p className="text-xs uppercase tracking-widest text-primary mb-1">System Log</p>
                                    <p>Initializing Zunios Core...</p>
                                    <p>Loading Vector Embeddings... [OK]</p>
                                    <p>Connecting Neural Pathways... [OK]</p>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <p className="text-white italic">"The unexamined life is not worth recording. The examined life builds empires."</p>
                                    <p className="text-right mt-2 text-xs opacity-50">— Core Protocol</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
