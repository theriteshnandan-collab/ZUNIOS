"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Moon, Sparkles, Lightbulb, Target, BrainCircuit } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import TitanInput from "@/components/TitanInput";
import { cn } from "@/lib/utils";
import { useMode } from "@/components/ModeProvider";
import { EntryMode } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DreamLoader from "@/components/DreamLoader";
import confetti from "canvas-confetti";
import ZuniosLogo from "@/components/ZuniosLogo";
import { useTaskStore } from "@/stores/taskStore";
import { useAppBadge } from "@/hooks/useAppBadge";
import { parseCommandLocally } from "@/lib/local-intelligence";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { BentoGrid, EliteBentoCard } from "@/components/ui/BentoGrid";
import { NeuralVisual, SyncVisual, CaptureVisual, VaultVisual } from "@/components/ui/BentoVisuals";
import neuralCoreImage from "@/public/images/POLLOAIONE.png";
import biometricImage from "@/public/images/BIOMETRICWAVEFORM.png";
import voiceImage from "@/public/images/SOUNDWAVES.png";
import vaultImage from "@/public/images/ENCRYPTEDVAULT.png";
import mindImage from "@/public/images/MIND.png";
import neuralComplexImage from "@/public/images/THENEURAL.png";

import dynamic from "next/dynamic";

const LandingSections = dynamic(() => import("@/components/marketing/LandingSections"), { ssr: false });
const MobileDashboard = dynamic(() => import("@/components/mobile/MobileDashboard"), { ssr: false });
const AuraCore = dynamic(() => import("@/components/AuraCore"), { ssr: false });
import { Activity, Disc, Zap, Brain, Calendar, Shield, Share2, Hexagon, Database } from "lucide-react";

const RevelationView = dynamic(() => import("@/components/RevelationView"), {
  ssr: false,
});

// --- FEATURE ITEM ---
const FeatureItem = ({ icon: Icon, label, desc }: { icon: any, label: string, desc: string }) => (
  <div className="flex flex-col items-center text-center space-y-2.5 group cursor-default">
    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] group-hover:bg-violet-500/10 group-hover:border-violet-500/25 transition-all duration-500 group-hover:scale-110">
      <Icon className="w-5 h-5 text-white/25 group-hover:text-violet-400 transition-colors duration-300" />
    </div>
    <div className="space-y-0.5">
      <div className="text-xs font-semibold text-white/50 group-hover:text-white/90 transition-colors tracking-wide">{label}</div>
      <div className="text-[9px] text-white/20 font-medium uppercase tracking-[0.15em]">{desc}</div>
    </div>
  </div>
);

// --- FEATURE SECTION ---
const FeatureSection = ({
  visual: Visual,
  image,
  title,
  description,
  align = "left",
  delay = 0,
  tag
}: {
  visual: any,
  image?: StaticImageData,
  title: string,
  description: string,
  align?: "left" | "right",
  delay?: number,
  tag?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex flex-col md:flex-row items-center gap-10 md:gap-24 py-20 max-w-6xl mx-auto px-8 group/section",
        align === "right" ? "md:flex-row-reverse" : ""
      )}
    >
      {/* SCROLL LINE NODE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[130%] bg-gradient-to-b from-transparent via-violet-500/15 to-transparent hidden md:block -z-10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#050510] border border-violet-500/40 rounded-full hidden md:block z-0 shadow-[0_0_12px_rgba(139,92,246,0.6)]" />

      {/* VISUAL SIDE */}
      <div className="w-full md:w-1/2">
        <div className="relative w-full h-[220px] md:h-[300px] rounded-[2.5rem] overflow-hidden border border-white/[0.07] bg-black/40 backdrop-blur-xl group-hover/section:border-violet-500/20 group-hover/section:shadow-[0_0_80px_-20px_rgba(139,92,246,0.2)] transition-all duration-700 shadow-[0_0_40px_-15px_rgba(0,0,0,0.8)]">
          {image ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 image-glow"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority={false}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 z-0"><Visual /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/30 pointer-events-none z-10" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.04] rounded-[2.5rem] pointer-events-none z-20" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-600/15 rounded-full blur-2xl z-0" />
        </div>
      </div>

      {/* TEXT SIDE */}
      <div className="w-full md:w-1/2 space-y-5 text-center md:text-left relative z-10">
        {tag && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/70 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
            {tag}
          </span>
        )}
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.05]">
          {title}
        </h2>
        <p className="text-base md:text-lg text-white/35 font-light leading-relaxed max-w-md mx-auto md:mx-0">
          {description}
        </p>
        <div className="pt-2 flex justify-center md:justify-start">
          <div className="h-px w-12 bg-gradient-to-r from-violet-500/60 to-transparent rounded-full" />
        </div>
      </div>
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
    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-8 py-16"
  >
    {[
      { value: "AI", label: "Neural Analysis" },
      { value: "E2E", label: "Encrypted" },
      { value: "∞", label: "Memory Bank" },
      { value: "0ms", label: "Local Processing" },
    ].map((stat) => (
      <div key={stat.label} className="text-center group">
        <div className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent mb-2 group-hover:from-violet-300 group-hover:to-violet-300/30 transition-all duration-500">
          {stat.value}
        </div>
        <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium">{stat.label}</div>
      </div>
    ))}
  </motion.div>
);

// WRAPPER COMPONENT TO HANDLE SCROLL LOGIC
const NarrativeFlowLines = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div className="w-full mt-4 pb-16 hidden sm:block">

      {/* SECTION DIVIDER */}
      <div className="max-w-6xl mx-auto px-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.05]" />
          <span className="text-[10px] text-white/15 uppercase tracking-[0.3em] font-medium whitespace-nowrap">What Zunios Does</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.05]" />
        </div>
      </div>

      {/* STATS STRIP */}
      <StatsStrip />

      {/* CONNECTED FEATURES CONTAINER */}
      <div ref={containerRef} className="relative pb-20">
        {/* DYNAMIC SCROLL LINE */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/30 to-violet-500/0 -translate-x-1/2 origin-top z-0"
          style={{ scaleY, opacity }}
        />

        <FeatureSection
          visual={NeuralVisual}
          image={neuralCoreImage}
          title="The Neural Core"
          description="An advanced AI engine that maps your thoughts into a living constellation. Patterns emerge automatically, revealing insights you never knew existed."
          align="left"
          tag="AI Analysis"
        />

        <FeatureSection
          visual={SyncVisual}
          image={biometricImage}
          title="Daily Sync"
          description="Your biological rhythm, visualized. Track your cognitive peak and ensure your system is optimal every single day."
          align="right"
          tag="Biometric Data"
        />

        <FeatureSection
          visual={CaptureVisual}
          image={voiceImage}
          title="Voice Command"
          description="Speak to the machine. The Arc Reactor core processes natural language instantly into structured, searchable intelligence."
          align="left"
          tag="Voice Input"
        />

        <FeatureSection
          visual={VaultVisual}
          image={vaultImage}
          title="Zero-Knowledge Vault"
          description="Your mind is private property. Military-grade encryption ensures only you hold the keys to your thoughts, forever."
          align="right"
          tag="Privacy First"
        />
      </div>

      {/* CAPABILITIES GRID */}
      <div className="pt-20 px-8 max-w-6xl mx-auto border-t border-white/[0.04]">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400/60">Full Stack</span>
            <h3 className="text-3xl md:text-4xl font-serif text-white/90 mt-3">System Capabilities</h3>
          </motion.div>
          <div className="h-px w-16 bg-gradient-to-r from-violet-500/50 to-transparent mx-auto" />
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
              className="relative p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/[0.05] group-hover:to-transparent transition-all duration-700 rounded-3xl" />
              <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-white/15 transition-all duration-300 relative z-10">
                <item.icon className="w-5 h-5 text-white/35 group-hover:text-violet-300 transition-colors duration-300" />
              </div>
              <h4 className="text-base font-bold text-white/80 mb-2.5 relative z-10 group-hover:text-white transition-colors">{item.title}</h4>
              <p className="text-white/30 text-sm leading-relaxed relative z-10">{item.desc}</p>
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

  const [streak, setStreak] = useState(0);

  // Brick 9.5: Real Streak Logic
  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit_date');
    const currentStreak = parseInt(localStorage.getItem('current_streak') || '0');
    const today = new Date().toDateString();

    if (lastVisit === today) {
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        const newStreak = currentStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('current_streak', newStreak.toString());
      } else {
        setStreak(1); // Reset or Start
        localStorage.setItem('current_streak', '1');
      }
      localStorage.setItem('last_visit_date', today);
    }
  }, []);

  // 🔗 BRICK W3: SHORTCUT ROUTER
  useEffect(() => {
    const shortcutMode = searchParams.get('mode');
    if (shortcutMode && ['task', 'idea', 'journal', 'dream', 'thought'].includes(shortcutMode)) {
      const targetMode = shortcutMode === 'task' ? 'thought' : (shortcutMode as EntryMode);
      setMode(targetMode);
      router.replace('/', { scroll: false });
      toast.info(`Mode set to: ${shortcutMode.toUpperCase()}`);
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
        colors: ["#8b5cf6", "#a78bfa", "#ffffff"]
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
      <div className="min-h-screen flex flex-col items-center relative z-10">

        {isLoading && <DreamLoader mode={mode} />}

        {/* ——— HERO SECTION ——— */}
        <div className="w-full max-w-5xl mx-auto px-6 pt-28 pb-10 text-center relative">

          {/* Gradient Mesh Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-gradient-to-b from-violet-950/50 via-purple-950/20 to-transparent blur-[90px]" />
            <div className="absolute top-32 left-[8%] w-[400px] h-[400px] rounded-full bg-cyan-950/25 blur-[100px]" />
            <div className="absolute top-32 right-[8%] w-[400px] h-[400px] rounded-full bg-indigo-950/25 blur-[100px]" />
          </div>

          {/* Launch Badge — non-users only */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.07] text-xs font-medium text-violet-300/70 mb-10 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Mind OS · Now in Beta
            </motion.div>
          )}

          {/* Logo */}
          <div className="flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-purple-600/8 blur-[80px] rounded-full scale-[3] pointer-events-none" />
            <ZuniosLogo size={user ? "lg" : "xl"} showText={true} className="flex-col !gap-4 relative z-10" />
          </div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden sm:block mb-6"
          >
            <h1 className={cn(
              "font-bold font-serif tracking-tight leading-[0.88] pb-4",
              user ? "text-5xl md:text-7xl" : "text-6xl md:text-[7.5rem]"
            )}>
              <span className="bg-gradient-to-b from-white via-white/95 to-white/20 bg-clip-text text-transparent">
                The OS for
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                Your Mind.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className={cn(
              "hidden sm:block leading-relaxed max-w-lg mx-auto",
              user ? "text-lg text-white/30 mb-8" : "text-xl text-white/35 mb-10"
            )}
          >
            {user
              ? "Capture visions. Build ideas. Log moments. Think deeply."
              : "Capture ideas. Analyze patterns. Extract intelligence.\nThe cognitive layer between your mind and the world."}
          </motion.p>

          {/* CTA Buttons — non-users, desktop */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden sm:flex items-center justify-center gap-4 mb-14"
            >
              <button className="group relative px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm transition-all duration-300 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.18)] flex items-center gap-2 overflow-hidden">
                <span className="relative z-10">Start Thinking Free</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </button>
              <button className="px-8 py-3.5 rounded-full border border-white/[0.09] text-white/40 font-medium text-sm hover:border-white/20 hover:text-white/70 transition-all duration-300">
                See How It Works
              </button>
            </motion.div>
          )}

          {/* Tech Trust Strip — non-users, desktop */}
          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden sm:flex items-center justify-center gap-2.5 mb-16 flex-wrap"
            >
              <span className="text-[10px] text-white/15 uppercase tracking-[0.25em] mr-3">Built with</span>
              {["Groq AI", "Supabase", "Vector Search", "Edge Runtime", "Next.js"].map((t, i) => (
                <span key={i} className="text-[11px] font-mono text-white/25 px-3 py-1 rounded-full border border-white/[0.06] hover:text-white/45 hover:border-white/12 transition-colors duration-300 cursor-default">
                  {t}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* ——— TITAN INPUT ——— */}
        <div className="w-full max-w-2xl mx-auto px-4 pb-8">
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
      <div className="min-h-screen flex items-center justify-center bg-[#050510]">
        <div className="animate-pulse text-white/20">Initializing Core...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
