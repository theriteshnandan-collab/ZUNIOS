"use client";

import { motion } from "framer-motion";
import { Gamepad2, Database, Search, Shield, Zap, Layers } from "lucide-react";

export default function FeaturesGrid() {
    const features = [
        {
            icon: Search,
            title: "Semantic Search",
            desc: "Don't search for keywords. Search for concepts. Find 'that idea about space' instantly."
        },
        {
            icon: Gamepad2,
            title: "Life Gamification",
            desc: "Turn habits into XP. Track your 'Wins' and watch your level increase as you execute."
        },
        {
            icon: Database,
            title: "Local-First Speed",
            desc: "Your thoughts utilize Redis edge caching for sub-millisecond retrieval."
        },
        {
            icon: Shield,
            title: "Privacy Core",
            desc: "Your consciousness is encrypted. Guest mode runs entirely in your browser's local storage."
        },
        {
            icon: Zap,
            title: "Omni-Input",
            desc: "One bar for everything. Visions, tasks, logs, or ideas. The AI sorts it tailored to you."
        },
        {
            icon: Layers,
            title: "Context Layers",
            desc: "Zunios understands mood and theme. It tags your entries automatically."
        }
    ];

    return (
        <section className="py-24 px-6 bg-black/20">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                        System Architecture
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Built for speed, depth, and intelligence. The Zunios stack is designed for the high-performance mind.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-white/70 group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
