import { Metadata } from "next";
import { Shield, Lock, EyeOff, Key, Zap, Info } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Manifesto | Zunios",
    description: "Our uncompromising commitment to neural privacy and zero-knowledge architecture.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#080808] text-white selection:bg-white/20">
            {/* HERO SECTION */}
            <header className="pt-32 pb-20 px-6 border-b border-white/[0.03]">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.3em] uppercase text-white/50">
                        Top Tier Privacy
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight leading-[0.9]">
                        The Mind <br />
                        <span className="text-white/30 italic font-medium">Manifesto.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/40 font-light max-w-2xl leading-relaxed">
                        Your thoughts are private property. We built Zunios on the principle that 
                        no machine—and no human—should have access to your raw consciousness.
                    </p>
                </div>
            </header>

            {/* THE PILLARS */}
            <main className="max-w-4xl mx-auto px-6 py-24 space-y-32">
                
                {/* PILLAR 1: ZERO KNOWLEDGE */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white/80" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold italic">Zero-Knowledge Architecture</h2>
                        <p className="text-white/50 leading-relaxed">
                            When you save a vision to Zunios, your browser encrypts the data using **AES-256-GCM** 
                            on your local hardware. The decryption key is generated from your session and 
                            never leaves your device.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                "No plaintext storage on the server",
                                "Keys are derived locally in the secure enclave",
                                "Tamper-proof integrity checks on every load"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                    <Zap className="w-3 h-3 text-white/30" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] glass-morphism-2 aspect-square flex flex-col justify-center gap-4">
                        <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-4">Encryption Logic</div>
                        <div className="h-px bg-white/10 w-full" />
                        <div className="flex justify-between items-center text-[11px] font-mono text-white/40">
                            <span>Plaintext</span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-white/80">AES-GCM-256</span>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] break-all leading-relaxed text-white/20 select-none">
                            {"U2FsdGVkX1+z8N0nZ5J3X+QZ..."}
                            {"8p0Z7F1/5XpX1ZpX1ZpX1ZpX..."}
                        </div>
                        <div className="h-px bg-white/10 w-full" />
                        <div className="text-[10px] font-mono text-white/30 italic">Server only sees the payload above.</div>
                    </div>
                </section>

                {/* PILLAR 2: LOCAL FIRST */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                    <div className="md:order-2 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white/80" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold italic">Local-First Persistence</h2>
                        <p className="text-white/50 leading-relaxed">
                            Zunios uses an offline-ready engine. Even without a connection, 
                            your thoughts are secured to your device's internal storage and 
                            synchronized only when you command it.
                        </p>
                    </div>
                    <div className="md:order-1 p-10 rounded-[40px] border border-white/[0.05] relative overflow-hidden group aspect-video flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                        <EyeOff className="w-20 h-20 text-white/[0.03] group-hover:text-white/[0.06] transition-all duration-700" />
                        <div className="absolute bottom-10 left-10 text-[10px] font-mono tracking-widest text-white/20">PRIVATE_STORAGE_INIT</div>
                    </div>
                </section>

                {/* THE CORE COMMITMENT */}
                <section className="pt-20 border-t border-white/[0.05] text-center space-y-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-4xl font-serif font-bold tracking-tight">Our Zero-Trust Commitment.</h3>
                        <p className="text-white/40 leading-relaxed">
                            We believe that your digital life should be a fortress. Zunios is engineered 
                            to be unhackable at the source—because the most valuable information 
                            should never exist in a vulnerable state.
                        </p>
                        <div className="pt-8">
                            <Link href="/">
                                <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-all duration-300">
                                    Return to Core
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="py-20 px-6 border-t border-white/[0.03] text-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20">
                    Sovereign Mind OS • Secured by AES-GCM
                </p>
            </footer>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    )
}
