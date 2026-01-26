"use client";

import { Quote } from "lucide-react";
import AboutSection from "./AboutSection";
import ConnectSection from "./ConnectSection";
import FeaturesGrid from "./FeaturesGrid";

export default function LandingSections() {
    return (
        <div className="w-full relative z-10 mt-24">

            {/* 1. The Philosophy */}
            <AboutSection />

            {/* 2. The Architecture */}
            <FeaturesGrid />

            {/* 3. Social Proof */}
            <section className="relative py-24 px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5 blur-3xl -z-10" />

                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">
                        Join the <span className="text-purple-400">Cognitive Elite</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <TestimonialCard
                        quote="I used to forget my best ideas. Now Zunios turns them into execution plans automatically."
                        author="Alex C."
                        role="Founder"
                    />
                    <TestimonialCard
                        quote="The dream analysis is scary accurate. It's like having a therapist in my pocket."
                        author="Sarah J."
                        role="Artist"
                    />
                    <TestimonialCard
                        quote="Finally, a journaling app that actually does something with what I write."
                        author="Marcus R."
                        role="Developer"
                    />
                </div>
            </section>

            {/* 4. The Network */}
            <ConnectSection />
        </div>
    );
}

function TestimonialCard({ quote, author, role }: any) {
    return (
        <div className="relative p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
            <Quote className="w-8 h-8 text-white/10 mb-4 absolute top-6 left-6" />
            <p className="text-lg text-white/80 font-serif italic mb-6 relative z-10 leading-relaxed">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                <div>
                    <p className="text-sm font-bold text-white">{author}</p>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{role}</p>
                </div>
            </div>
        </div>
    );
}
