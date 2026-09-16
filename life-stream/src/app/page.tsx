"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  Moon, Sparkles, Lightbulb, Target, BrainCircuit, Brain, Database,
  Hexagon, Share2, Shield, Zap, Activity, ArrowRight, Eye, Wand2
} from "lucide-react";
import Image from "next/image";
import TitanInput from "@/components/TitanInput";
import { cn } from "@/lib/utils";
import { useMode } from "@/components/ModeProvider";
import { EntryMode } from "@/lib/theme-config";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DreamLoader from "@/components/DreamLoader";
import confetti from "canvas-confetti";
import ZuniosLogo from "@/components/ZuniosLogo";
import { useTaskStore } from "@/stores/taskStore";
import { useAppBadge } from "@/hooks/useAppBadge";
import { parseCommandLocally } from "@/lib/local-intelligence";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { NeuralVisual, SyncVisual, CaptureVisual, VaultVisual } from "@/components/ui/BentoVisuals";
import heroCinematicImage from "../../public/images/hero-sunrays.jpg";
import heroMobileCinematicImage from "../../public/images/hero-sunrays-mobile.jpg";
import dynamic from "next/dynamic";

const RevelationView = dynamic(() => import("@/components/RevelationView"), {
  ssr: false,
});

// --- FEATURE ITEM ---
const FeatureItem = ({ icon: Icon, label, desc }: { icon: any, label: string, desc: string }) => (
  <div className="flex flex-col items-center text-center space-y-2.5 group cursor-default">
    <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/20 transition-all duration-500 group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
      <Icon className="w-5 h-5 text-white transition-colors duration-300" />
    </div>
    <div className="space-y-0.5">
      <div className="text-xs font-semibold text-white tracking-wide">{label}</div>
      <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em]">{desc}</div>
    </div>
  </div>
);

// --- TIMELINE NODE (FEATURE SECTION) ---
const FeatureSection = ({
  visual: Visual,
  title,
  description,
  align = "left",
  tag
}: {
  visual: any,
  title: string,
  description: string,
  align?: "left" | "right",
  tag?: string
}) => {
  const isRight = align === "right";

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center 45%"]
  });

  const visualX = useTransform(scrollYProgress, [0, 1], [isRight ? -40 : 40, 0]);
  const textX = useTransform(scrollYProgress, [0, 1], [isRight ? 20 : -20, 0]);
  const commonOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const nodeScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const sparkScaleX = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative flex flex-col md:flex-row items-center gap-10 md:gap-24 py-24 max-w-6xl mx-auto px-8 group/section transform-gpu",
        isRight ? "md:flex-row-reverse" : ""
      )}
    >
      {/* TIMELINE SOCKET & SPARK */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10 pointer-events-none">
        {/* The Node Socket */}
        <motion.div
          style={{ scale: nodeScale, opacity: commonOpacity }}
          className="relative w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-400/60 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center transform-gpu"
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </motion.div>

        {/* The Horizontal Spark Line */}
        <motion.div
          style={{ scaleX: sparkScaleX, opacity: commonOpacity }}
          className={cn(
            "absolute h-[2px] bg-gradient-to-r w-24 transform-gpu",
            isRight
              ? "right-2 origin-left from-white/40 to-transparent"
              : "left-2 origin-right from-transparent to-white/40"
          )}
        />
      </div>

      {/* VISUAL SIDE — Double-Bezel Hardware Enclosure */}
      <motion.div
        style={{
          x: visualX,
          opacity: commonOpacity,
          WebkitBackfaceVisibility: "hidden"
        }}
        className="w-full md:w-1/2 relative z-20 transform-gpu"
      >
        <div className="relative rounded-[22px] bg-white/[0.035] border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] group-hover/section:border-white/25 group-hover/section:shadow-[0_40px_90px_-15px_rgba(0,0,0,0.9)] transition-all duration-700 p-1.5 backdrop-blur-2xl">
          <div className="relative w-full h-[260px] md:h-[340px] rounded-[calc(22px-0.375rem)] overflow-hidden bg-black border border-white/[0.06]">

            {/* Monitor Chrome */}
            <div className="absolute top-0 left-0 right-0 z-30 h-8 bg-black/60 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]/80" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">ACTIVE CORE</span>
              </div>
            </div>

            <div className="absolute inset-0 z-0 p-1"><Visual /></div>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.08] rounded-[calc(22px-0.375rem)] pointer-events-none z-30" />
          </div>
        </div>
      </motion.div>

      {/* TEXT SIDE */}
      <motion.div style={{ x: textX, opacity: commonOpacity, WebkitBackfaceVisibility: "hidden" }} className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-10 transform-gpu">
        {tag && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-300 bg-white/[0.06] border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            {tag}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.05]">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-md mx-auto md:mx-0">
          {description}
        </p>
        <div className="pt-4 flex justify-center md:justify-start">
          <div className="h-[2px] w-16 bg-gradient-to-r from-zinc-400/50 to-transparent rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- STATS STRIP ---
const StatsStrip = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="grid grid-cols-4 gap-4 md:gap-12 max-w-6xl mx-auto px-4 md:px-8 py-16"
  >
    {[
      { value: "Neural Analysis", label: "Thought mapping" },
      { value: "Encrypted", label: "Zero-knowledge" },
      { value: "Infinite Memory", label: "Vector-recall" },
      { value: "Instant", label: "Edge processing" },
    ].map((stat) => (
      <div key={stat.label} className="text-center group">
        <div className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold font-serif bg-gradient-to-b from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-2 group-hover:text-white transition-colors duration-500 tracking-tighter leading-none whitespace-nowrap">
          {stat.value}
        </div>
        <div className="text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-[0.1em] md:tracking-[0.25em] font-mono font-medium">{stat.label}</div>
      </div>
    ))}
  </motion.div>
);

// --- HERO BACKGROUND (PERSISTENT ATMOSPHERE) ---
const HeroBackground = ({ isDashboard = false }: { isDashboard?: boolean }) => {
  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none">
      {/* Mobile Cinematic Photo Background */}
      <Image
        src={heroMobileCinematicImage}
        alt=""
        fill
        className={cn(
          "object-cover object-center transition-all duration-1000 ease-out md:hidden",
          isDashboard ? "scale-105 blur-[1px] opacity-40" : "scale-100 opacity-100"
        )}
        priority
      />

      {/* Desktop Cinematic Photo Background */}
      <Image
        src={heroCinematicImage}
        alt=""
        fill
        className={cn(
          "object-cover object-center transition-all duration-1000 ease-out hidden md:block",
          isDashboard ? "scale-105 blur-[1px] opacity-40" : "scale-100 opacity-100"
        )}
        priority
      />

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-black/0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

      {/* Surface Depth Highlight */}
      <div className="absolute w-[1000px] h-[1000px] bg-white/[0.01] rounded-full blur-[200px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Frame Diagnostic Brackets (Persistent System Spine) */}
      <div className="hidden md:block absolute top-[72px] left-6 w-14 h-14 border-t-[1.5px] border-l-[1.5px] border-white/20 z-20 transition-opacity duration-700" />
      <div className="hidden md:block absolute top-[72px] right-6 w-14 h-14 border-t-[1.5px] border-r-[1.5px] border-white/20 z-20 transition-opacity duration-700" />
      <div className="hidden md:block absolute bottom-6 left-6 w-14 h-14 border-b-[1.5px] border-l-[1.5px] border-white/20 z-20 transition-opacity duration-700" />
      <div className="hidden md:block absolute bottom-6 right-6 w-14 h-14 border-b-[1.5px] border-r-[1.5px] border-white/20 z-20 transition-opacity duration-700" />

      {/* Frame Diagnostic Nodes */}
      <div className="hidden md:block absolute top-[72px] left-6 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-[2px] -translate-y-[2px] z-20" />
      <div className="hidden md:block absolute top-[72px] right-6 w-1.5 h-1.5 bg-white/40 rounded-full translate-x-[2px] -translate-y-[2px] z-20" />
      <div className="hidden md:block absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-[2px] translate-y-[2px] z-20" />
      <div className="hidden md:block absolute bottom-6 right-6 w-1.5 h-1.5 bg-white/40 rounded-full translate-x-[2px] translate-y-[2px] z-20" />
    </div>
  );
};

const CinematicHero = () => {
  const [activeSpec, setActiveSpec] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpec(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden hidden md:flex">

      {/* Main Content — z-10, above canvas */}
      <div className="relative z-10 flex-1 flex flex-col justify-start w-full pt-16">
        <div className="w-full max-w-7xl mx-auto px-10 xl:px-16 relative" style={{ filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.8))" }}>

          {/* RIGHT SIDE FEATURE STRIP — Zinc / Titanium Order */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.5 }}
            className="absolute top-0 right-10 xl:right-16 hidden lg:flex flex-col gap-3 items-end"
          >
            {/* The Connecting Data Spine — Zinc Metallic Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-400/30 to-transparent" />

            {[
              { value: "Neural Analysis", label: "Real-time thought mapping", icon: Activity },
              { value: "Encrypted", label: "Zero-knowledge security", icon: Shield },
              { value: "Infinite Memory", label: "Vector-embedded recall", icon: Database },
              { value: "Instant", label: "Edge runtime processing", icon: Zap },
            ].map((s, idx) => {
              const isAutoActive = activeSpec === idx;
              return (
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                  className="group relative pr-10 py-3 text-right"
                >
                  {/* Connection Node — Zinc Glow */}
                  <div className={cn(
                    "absolute right-[-3.5px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full transition-all duration-700",
                    isAutoActive
                      ? "bg-zinc-100 shadow-[0_0_12px_rgba(255,255,255,0.5)] scale-110"
                      : "bg-zinc-600/60 border border-zinc-400/40 group-hover:bg-zinc-100 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                  )} />

                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={cn(
                        "text-sm font-bold tracking-tight uppercase leading-none transition-all duration-700",
                        isAutoActive ? "text-white translate-x-[-2px]" : "text-zinc-200 group-hover:text-white"
                      )}>{s.value}</span>
                      <s.icon className={cn(
                        "w-4 h-4 transition-all duration-700",
                        isAutoActive ? "text-white scale-110" : "text-zinc-500 group-hover:text-zinc-200"
                      )} />
                    </div>
                    <div className={cn(
                      "text-[11px] font-medium leading-none transition-all duration-700",
                      isAutoActive ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"
                    )}>{s.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Badge */}
          <div className="space-y-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm text-xs font-medium text-white/70"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              AI-Powered Mind OS · Now in Beta
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl xl:text-7xl font-bold font-serif tracking-tight leading-none whitespace-nowrap"
            >
              <span className="text-white">The OS for </span>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Your Mind.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <p className="text-sm md:text-base text-white/40 leading-relaxed font-medium">
                Zunios is your cognitive peripheral. It captures the raw flow of your thoughts, ideas, and visions into a secure neural vault. Through advanced pattern analysis, it transforms your mental entropy into structured intelligence.
              </p>
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]" />

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start justify-between gap-16"
            >
              <div className="space-y-6 max-w-md">
                <p className="text-lg text-white/65 font-light leading-relaxed">
                  Capture ideas. Analyze patterns. Extract intelligence.<br />
                  The cognitive layer between your mind and the world.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event("focus-titan-input"));
                      const textarea = document.getElementById("titan-textarea") as HTMLTextAreaElement || document.querySelector<HTMLTextAreaElement>('#titan-input textarea');
                      if (textarea) {
                        textarea.scrollIntoView({ behavior: "smooth", block: "center" });
                        setTimeout(() => {
                          textarea.focus();
                        }, 120);
                      } else {
                        document.getElementById("titan-input")?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className="group relative pl-7 pr-2.5 py-2 rounded-full bg-white text-black font-semibold text-sm transition-all duration-300 active:scale-[0.98] hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] flex items-center gap-3 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                    <span className="relative z-10">Start Thinking Free</span>
                    <span className="relative z-10 w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[0.5px] scale-100 group-hover:scale-105">→</span>
                  </button>
                  <button
                    onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-7 py-3 rounded-full border border-white/20 text-white/80 font-medium text-sm hover:border-white/50 hover:text-white hover:bg-white/[0.05] transition-all duration-300 bg-black/30 backdrop-blur-md cursor-pointer active:scale-[0.98]">
                    See How It Works
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};


// WRAPPER COMPONENT TO HANDLE SCROLL LOGIC
const NarrativeFlowLines = () => {
  return (
    <div id="how-it-works" className="w-full mt-10 pb-24 hidden sm:block bg-[#050505] relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient Depth Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-8 mb-4 pt-16">
        <div className="flex items-center gap-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] text-zinc-400 uppercase tracking-[0.35em] font-mono font-bold whitespace-nowrap">The Architecture</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>

      {/* STATS STRIP */}
      <StatsStrip />

      {/* CONNECTED FEATURES CONTAINER */}
      <div className="relative pb-24">
        {/* STATIC PASSIVE SPINE */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-0">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>

        <FeatureSection
          visual={NeuralVisual}
          title="The Neural Core"
          description="An advanced AI engine that maps your thoughts into a living constellation. Patterns emerge automatically, revealing insights you never knew existed."
          align="left"
          tag="AI Analysis"
        />

        <FeatureSection
          visual={SyncVisual}
          title="Daily Sync"
          description="Your biological rhythm, visualized. Track your cognitive peak and ensure your system is optimal every single day."
          align="right"
          tag="Biometric Data"
        />

        <FeatureSection
          visual={CaptureVisual}
          title="Voice Command"
          description="Speak to the machine. The Arc Reactor core processes natural language instantly into structured, searchable intelligence."
          align="left"
          tag="Voice Input"
        />

        <FeatureSection
          visual={VaultVisual}
          title="Zero-Knowledge Vault"
          description="Your mind is private property. Military-grade encryption ensures only you hold the keys to your thoughts, forever."
          align="right"
          tag="Privacy First"
        />
      </div>

      {/* CAPABILITIES GRID */}
      <div className="pt-20 px-8 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-3 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">Full Stack Infrastructure</span>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mt-3 tracking-tight">System Capabilities</h3>
            <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-md mx-auto">Engineered from first principles for instant neural capture and zero-latency recall.</p>
          </motion.div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto pt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Neural Input", desc: "Natural language processing that understands context, intent, and emotional state in real-time.", icon: Brain },
            { title: "Quantum Sync", desc: "Real-time state synchronization across all your logged-in neural interfaces and devices.", icon: Share2 },
            { title: "Task Matrices", desc: "Auto-prioritization of objectives based on urgency, cognitive load, and strategic importance.", icon: Target },
            { title: "Visual Recall", desc: "Vector-embedded memory storage for instant, photographic-quality information retrieval.", icon: Sparkles },
            { title: "Flow States", desc: "Focus modes engineered to warp your perception of time and induce deep productive flow.", icon: Activity },
            { title: "Secure Core", desc: "Local-first encryption architecture. Your thoughts never leave the secure enclave unencrypted.", icon: Shield },
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              key={i}
              className="relative p-1 rounded-[22px] bg-white/[0.03] border border-white/10 hover:border-white/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-500 group overflow-hidden"
            >
              <div className="p-6 rounded-[calc(22px-0.25rem)] bg-zinc-950/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/[0.1] transition-all duration-300 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
                    <item.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 relative z-10">{item.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed relative z-10 group-hover:text-zinc-300 transition-colors">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

function HomeContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<any>(null);

  // MODE STATE (Global)
  const { mode, setMode } = useMode();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const addTask = useTaskStore((state) => state.addTask);
  const tasks = useTaskStore((state) => state.tasks);
  const incompleteCount = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;

  useAppBadge(incompleteCount);
  const { scrollYProgress } = useScroll();

  // Track visit streak in localStorage (used by analytics)
  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit_date');
    const currentStreak = parseInt(localStorage.getItem('current_streak') || '0');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastVisit === yesterday.toDateString() ? currentStreak + 1 : 1;
      localStorage.setItem('current_streak', newStreak.toString());
      localStorage.setItem('last_visit_date', today);
    }
  }, []);

  // 🔗 BRICK W3: SHORTCUT ROUTER & AUTH URL LISTENER
  useEffect(() => {
    const shortcutMode = searchParams.get('mode');
    if (shortcutMode && ['task', 'idea', 'journal', 'dream', 'thought'].includes(shortcutMode)) {
      const targetMode = shortcutMode === 'task' ? 'thought' : (shortcutMode as EntryMode);
      setMode(targetMode);
      router.replace('/', { scroll: false });
      toast.info(`Mode set to: ${shortcutMode.toUpperCase()}`);
    }

    const authError = searchParams.get('auth_error');
    if (authError) {
      toast.error(decodeURIComponent(authError));
      router.replace('/', { scroll: false });
    }

    const openAuth = searchParams.get('open_auth');
    if (openAuth) {
      window.dispatchEvent(new Event('open-auth-modal'));
      router.replace('/', { scroll: false });
    }
  }, [searchParams, setMode, router]);

  // ♻️ BRICK: GUEST SYNC
  useEffect(() => {
    const syncGuestEntries = async () => {
      if (!user) return; // Only run if logged in

      const stored = localStorage.getItem('guest_dreams');
      if (!stored) return;

      const guestEntries = JSON.parse(stored);
      if (guestEntries.length === 0) return;

      toast.loading(`Syncing ${guestEntries.length} offline thoughts...`, { id: 'sync-toast' });

      let syncedCount = 0;
      const remainingEntries = [];

      for (const entry of guestEntries) {
        try {
          await fetch('/api/entries/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: entry.content,
              theme: entry.theme,
              mood: entry.mood,
              image_url: entry.image_url,
              category: entry.category,
              interpretation: entry.interpretation,
              user_id: user.id
            })
          });
          syncedCount++;
        } catch (err) {
          console.error("Sync failed for entry", entry);
          remainingEntries.push(entry);
        }
      }

      if (remainingEntries.length > 0) {
        localStorage.setItem('guest_dreams', JSON.stringify(remainingEntries));
        toast.error(`Sync partial: ${syncedCount}/${guestEntries.length} uploaded`, { id: 'sync-toast' });
      } else {
        localStorage.removeItem('guest_dreams');
        toast.success("Memory Core Synchronized", { description: "All offline entries secured.", id: 'sync-toast' });
        confetti({ particleCount: 30, spread: 50 });
      }
    };

    syncGuestEntries();
  }, [user]);

  const getModeData = () => {
    switch (mode) {
      case 'idea': return { title: "Build Something Great", icon: Lightbulb };
      case 'win': return { title: "Log Your Moment", icon: Sparkles };
      case 'journal':
      case 'thought': return { title: "Think It Through", icon: BrainCircuit };
      default: return { title: "Explore Your Vision", icon: Moon };
    }
  };

  const handleAnalyze = async (text: string, analysisMode: EntryMode) => {
    setIsLoading(true);
    try {
      // 🔀 COMMAND ROUTER (THE "EAR" OF ZUNIOS)
      const commandRegex = /^\s*(?:(add|create|new|plus|log|record|setup|schedule|deploy|execute|start)\s+(?:a\s+)?(task|todo|to-do|mission|reminder|op|operation|objective|entry)|(?:task|todo|to-do|mission|remind|reminder|op|operation|objective)|(?:remind|remember|don't\s+forget)(?:\s+me)?\s+to|(?:urgent|priority|important|p[1-3]):|i\s+(?:need|have|must)\s+to)\b/i;

      if (commandRegex.test(text)) {
        console.log("🚀 Command Detected: Routing to Task Engine");
        let taskData;
        try {
          const response = await fetch('/api/analyze-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: text })
          });
          if (!response.ok) throw new Error("API Error");
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          taskData = data;
        } catch (err) {
          console.warn("Cloud Intelligence Failed. Engaging Local Protocols.", err);
          taskData = parseCommandLocally(text);
          toast("Offline Intelligence Active", { description: "Cloud unreachable. Processed locally.", icon: <Zap className="w-4 h-4 text-amber-400" /> });
        }

        if (taskData.action === 'create' && taskData.data) {
          await addTask({
            content: taskData.data.content,
            priority: (taskData.data.priority?.toLowerCase() as any) || 'medium',
            due_date: taskData.data.due_date,
          });
        }
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        toast.success(taskData.action === 'create' ? "Mission Deployed" : "Command Executed", { description: taskData.data?.content || "Operation successful" });
        setIsLoading(false);
        return;
      }

      // 🔮 STANDARD ANALYSIS
      let analysisResult;
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dream: text, category: analysisMode })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${response.statusText} - ${errorText.substring(0, 100)}`);
        }
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        // Analysis complete (Silent Zen: Text Only)
        analysisResult = data;
      } catch (err: any) {
        console.error("Critical Analysis Error:", err);
        throw err;
      }

      // No image probes or pre-fetching needed in Silent Zen
      setResult({ ...analysisResult, content: text });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#e0e0e0", "#a0a0a0"]
      });

    } catch (err: any) {
      toast.error(err.message || "The mind is clouded. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const modeData = getModeData();
    if (!user) {
      try {
        const guestDream = { id: crypto.randomUUID(), content: result.content, theme: result.theme, mood: result.mood, image_url: result.imageUrl, category: mode, created_at: new Date().toISOString(), is_guest: true, interpretation: result.interpretation };
        const existing = JSON.parse(localStorage.getItem('guest_dreams') || '[]');
        const updated = [guestDream, ...existing];
        localStorage.setItem('guest_dreams', JSON.stringify(updated));
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success(`Saved to Temporary Notebook! 📝`, { description: "Sign in to save permanently.", duration: 5000 });
        setResult(null);
      } catch (error) { console.error("Guest save failed:", error); toast.error("Failed to save locally."); } finally { setIsSaving(false); }
      return;
    }
    setIsSaving(true);
    setIsSaving(true);
    try {
      const payload = {
        content: result.content,
        theme: result.theme,
        mood: result.mood,
        image_url: result.imageUrl,
        category: mode,
        user_id: user.id,
        interpretation: result.interpretation
      };

      console.log("Saving Entry Payload:", payload);

      const response = await fetch('/api/entries/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Server Response (Non-JSON):", responseText);
        throw new Error(`Server connection failed: ${responseText.substring(0, 50)}`);
      }

      if (data.error) throw new Error(data.error);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`${modeData.title} saved to Memory Core!`);
      setResult(null);
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // REVELATION VIEW
  if (result) {
    return (
      <RevelationView
        result={result}
        onClose={() => setResult(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    );
  }

  // MAIN VIEW
  return (
    <ParticleBackground>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white/20 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="min-h-[100dvh] flex flex-col items-center relative z-10">

        {isLoading && <DreamLoader mode={mode} />}

        {/* ——— PERSISTENT BACKGROUND ——— */}
        <HeroBackground isDashboard={!!user} />

        {/* ——— CINEMATIC HERO (non-users, desktop) ——— */}
        {!user && <CinematicHero />}

        {/* ——— COMPACT HERO (logged-in users, desktop) ——— */}
        {user && (
          <div className="w-full max-w-5xl mx-auto px-6 pt-28 pb-6 text-center relative hidden md:block">
            <div className="flex items-center justify-center mb-6 relative">
              <ZuniosLogo size="lg" showText={true} className="flex-col !gap-3 relative z-10" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-[0.88] pb-4"
            >
              <span className="bg-gradient-to-b from-white via-white/95 to-white/20 bg-clip-text text-transparent">The OS for </span>
              <span className="bg-gradient-to-r from-[#e8e8e8] via-[#c0c0c0] to-[#888888] bg-clip-text text-transparent">Your Mind.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-lg text-white/70 mb-8 max-w-md mx-auto font-medium"
            >
              Capture visions. Build ideas. Log moments. Think deeply.
            </motion.p>
          </div>
        )}

        {/* ——— MOBILE HERO (all users) ——— */}
        <div className="w-full max-w-5xl mx-auto px-6 pt-20 pb-4 text-center relative md:hidden">
          <div className="flex items-center justify-center mb-6 relative">
            <ZuniosLogo size="lg" showText={true} className="flex-col !gap-3 relative z-10" />
          </div>
          {!user && (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif tracking-tight leading-[0.92] pb-3">
                <span className="bg-gradient-to-b from-white via-white/95 to-white/40 bg-clip-text text-transparent">The OS for </span>
                <span className="bg-gradient-to-r from-[#e8e8e8] via-[#c0c0c0] to-[#888888] bg-clip-text text-transparent">Your Mind.</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 mb-6 max-w-xs mx-auto font-medium">Capture ideas. Analyze patterns. Extract intelligence.</p>
            </>
          )}
        </div>

        {/* ——— TITAN INPUT ——— */}
        <div id="titan-input" className="w-full max-w-2xl mx-auto px-4 pb-8">
          <TitanInput
            onAnalyze={handleAnalyze}
            isAnalyzing={isLoading}
            initialMode={mode}
            initialValue={searchParams.get('content') || ''}
          />
        </div>

        {/* ——— FEATURE STRIP ——— */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-4 gap-4 w-full max-w-2xl mx-auto px-4 pt-6 pb-20 border-t border-white/[0.04]"
        >
          <FeatureItem icon={Brain} label="Neural Core" desc="AI Processing" />
          <FeatureItem icon={Database} label="Memory Bank" desc="Vector Recall" />
          <FeatureItem icon={Hexagon} label="Task Engine" desc="Auto-Organize" />
          <FeatureItem icon={Share2} label="Sync Link" desc="Cross-Device" />
        </motion.div>

        {/* ——— NARRATIVE FLOW (non-users, desktop) ——— */}
        {!user && <NarrativeFlowLines />}
      </div>
    </ParticleBackground>
  );
}


export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="animate-pulse text-white/20">Initializing Core...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
