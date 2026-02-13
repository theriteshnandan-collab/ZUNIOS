"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Moon, Sparkles, Lightbulb, Target, BrainCircuit } from "lucide-react";
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
import DreamImage from "@/components/DreamImage";
import confetti from "canvas-confetti";
import LandingSections from "@/components/marketing/LandingSections";
import ZuniosLogo from "@/components/ZuniosLogo";
import { useTaskStore } from "@/stores/taskStore";
import { useAppBadge } from "@/hooks/useAppBadge";
import { parseCommandLocally } from "@/lib/local-intelligence";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import AuraCore from "@/components/AuraCore";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ShinyButton } from "@/components/ui/ShinyButton";
import { BentoGrid, EliteBentoCard } from "@/components/ui/BentoGrid";
import { NeuralVisual, SyncVisual, CaptureVisual, VaultVisual } from "@/components/ui/BentoVisuals";
import { Activity, Disc, Zap, Brain, Calendar, Shield, Share2, Hexagon, Database } from "lucide-react";

// --- SMALL FEATURE GRID COMPONENT ---
const FeatureItem = ({ icon: Icon, label, desc }: { icon: any, label: string, desc: string }) => (
  <div className="flex flex-col items-center text-center space-y-2 group cursor-default">
    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
      <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
    </div>
    <div className="space-y-0.5">
      <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</div>
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{desc}</div>
    </div>
  </div>
);

// --- ZIG-ZAG FEATURE COMPONENT ---
const FeatureSection = ({
  visual: Visual,
  title,
  description,
  align = "left",
  delay = 0
}: {
  visual: any,
  title: string,
  description: string,
  align?: "left" | "right",
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "relative flex flex-col md:flex-row items-center gap-8 md:gap-20 py-16 max-w-6xl mx-auto px-6 group/section",
        align === "right" ? "md:flex-row-reverse" : ""
      )}
    >

      {/* CONNECTED SCROLL LINE NODE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[120%] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden md:block -z-10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-950 border border-cyan-500/50 rounded-full hidden md:block z-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />

      {/* VISUAL SIDE */}
      <div className="w-full md:w-1/2">
        {/* PREMIUM VISUAL CONTAINER */}
        <div className="relative w-full h-[220px] md:h-[280px] rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a]/40 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] group-hover/section:border-cyan-500/30 group-hover/section:shadow-[0_0_60px_-15px_rgba(6,182,212,0.2)] transition-all duration-700">

          {/* Elite Visual Wrapper */}
          <div className="absolute inset-0 z-0">
            <Visual />
          </div>

          {/* Premium Glass Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none z-10" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[2rem] pointer-events-none z-20" />
        </div>
      </div>

      {/* TEXT SIDE */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-lg">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-blue-100/60 font-light leading-relaxed max-w-md mx-auto md:mx-0">
          {description}
        </p>
        <div className="pt-4 flex justify-center md:justify-start">
          <div className="h-0.5 w-16 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

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
    <div className="w-full mt-8 space-y-0 pb-12 hidden sm:block">

      {/* 1. CONNECTED FEATURES CONTAINER (Line exists only here) */}
      <div ref={containerRef} className="relative pb-20">
        {/* DYNAMIC SCROLL LINE */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 -translate-x-1/2 origin-top z-0"
          style={{ scaleY, opacity }}
        />

        {/* 1. NEURAL CORE */}
        <FeatureSection
          visual={NeuralVisual}
          title="The Neural Core"
          description="An advanced AI engine that maps your thoughts into a living constellation. Patterns emerge automatically."
          align="left"
        />

        {/* 2. MEMORY BANK */}
        <FeatureSection
          visual={SyncVisual}
          title="Daily Sync"
          description="Your biological rhythm, visualized. Track your cognitive peak and ensure your system is optimal every day."
          align="right"
        />

        {/* 3. QUICK CAPTURE */}
        <FeatureSection
          visual={CaptureVisual}
          title="Voice Command"
          description="Speak to the machine. The Arc Reactor core processes natural language instantly into structured data."
          align="left"
        />

        {/* 4. VAULT SECURITY */}
        <FeatureSection
          visual={VaultVisual}
          title="Zero-Knowledge Vault"
          description="Your mind is private property. Military-grade encryption ensures only you hold the keys to your thoughts."
          align="right"
        />
      </div>

      {/* 2. CAPABILITIES GRID (Outside the line flow) */}
      <div className="pt-16 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-2xl md:text-3xl font-serif text-white/90">System Capabilities</h3>
          <div className="h-1 w-20 bg-cyan-900/50 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Neural Input", desc: "Natural language processing that understands context, intent, and emotion.", icon: Brain },
            { title: "Quantum Sync", desc: "Real-time state synchronization across all your logged-in neural interfaces.", icon: Share2 },
            { title: "Task Matrices", desc: "Auto-prioritization of objectives based on urgency and your cognitive load.", icon: Target },
            { title: "Visual Recall", desc: "Vector-embedded image storage for instant photographic memory retrieval.", icon: Sparkles },
            { title: "Time Distortion", desc: "Focus modes that warp your perception of time to induce flow states.", icon: Activity },
            { title: "Secure Core", desc: "Local-first encryption. Your thoughts never leave the secure enclave unencrypted.", icon: Shield },
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-blue-100/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

function HomeContent() {
  // ... existing state ... (Lines 105-180 preserved via context usually, but here we replace the render)
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
        analysisResult = data;

        // 🖼️ PRE-LOAD IMAGE (Synchronized Reveal)
        // This ensures the loader stays active until the vision is ready
        if (analysisResult.imageUrl) {
          await new Promise((resolve) => {
            const img = new Image();
            img.src = analysisResult.imageUrl;
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
            // Timeout safety
            setTimeout(resolve, 15000);
          });
        }

      } catch (err: any) {
        console.warn("Dream Analysis Failed. Engaging Local Save.", err);
        analysisResult = { theme: "Raw Entry", mood: "Neutral", imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop", interpretation: [`Cloud analysis unavailable: ${err.message || 'Unknown Error'}. Entry saved safely.`], content: text };
        toast("Offline Save Active", { description: `Analysis skipped: ${err.message}`, icon: <Zap className="w-4 h-4 text-amber-400" /> });
      }
      setResult({ ...analysisResult, content: text });
    } catch (error: any) {
      console.error("Critical Failure:", error);
      toast.error(`System Error: ${error.message}`);
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

  // REVELATION VIEW (PRO DESIGN) - Immersive Split Layout
  if (result) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050510] text-white overflow-y-auto">
        {/* Close/Back Button */}
        <div className="absolute top-6 left-6 z-50">
          <Button
            variant="ghost"
            onClick={() => setResult(null)}
            className="text-white/50 hover:text-white hover:bg-white/10"
          >
            ← Back to Input
          </Button>
        </div>

        <div className="min-h-screen w-full flex flex-col lg:flex-row">

          {/* LEFT: VISUAL IMMERSION (50% Width) */}
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-screen bg-black">
            <DreamImage
              src={result.imageUrl}
              alt={result.theme}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#050510]" />
          </div>

          {/* RIGHT: INTELLECTUAL CORE (Text) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 space-y-8 bg-[#050510]">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-950/30 text-cyan-400 text-xs font-medium tracking-wide border border-cyan-500/20 uppercase">
                {result.mood || "ANALYSIS COMPLETE"}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white leading-[1.1]">
                {result.theme || "Your Vision"}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full h-px bg-gradient-to-r from-white/20 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              {/* Handling the new Paragraph format or fallback Array */}
              {Array.isArray(result.interpretation) ? (
                result.interpretation.map((item: string, i: number) => (
                  <p key={i} className="text-gray-300 leading-relaxed text-lg">{item}</p>
                ))
              ) : (
                <p className="text-gray-300 leading-8 text-xl font-light whitespace-pre-wrap">
                  {result.interpretation}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-8 flex gap-4"
            >
              <ShinyButton
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-4 text-base min-w-[180px]"
              >
                {isSaving ? "Saving..." : "Save to Core"}
              </ShinyButton>

              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="px-8 py-4 h-auto text-base border-white/10 hover:bg-white/5"
              >
                Discard
              </Button>
            </motion.div>

          </div>
        </div>
      </div>
    );
  }

  // INPUT VIEW (Particle Background)
  return (
    <ParticleBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 py-20">

        {isLoading && <DreamLoader mode={mode} />}

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 w-full max-w-2xl text-center space-y-10"
        >

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6 scale-125">
              <ZuniosLogo size="xl" showText={true} className="flex-col !gap-4" />
            </div>

            {/* 💻 DESKTOP HERO TEXT */}
            <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent pb-2 hidden sm:block">
              The OS for <br /> Your Mind
            </h1>

            <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed hidden sm:block font-light">
              Capture visions. Build ideas. Log moments. Think deeply.
            </p>
          </div>

          {/* Input Card - Titan Design System V2 */}
          <div className="w-full max-w-2xl mx-auto">
            <TitanInput
              onAnalyze={handleAnalyze}
              isAnalyzing={isLoading}
              initialMode={mode}
              initialValue={searchParams.get('content') || ''}
            />
          </div>

          {/* ✨ NEW FEATURE STRIP (Compact) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-4 gap-4 w-full max-w-2xl mx-auto pt-4 border-t border-white/5"
          >
            <FeatureItem icon={Brain} label="Neural Core" desc="AI Processing" />
            <FeatureItem icon={Database} label="Memory Bank" desc="Vector Recall" />
            <FeatureItem icon={Hexagon} label="Task Engine" desc="Auto-Organize" />
            <FeatureItem icon={Share2} label="Sync Link" desc="Cross-Device" />
          </motion.div>

        </motion.div>





        {/* 💻 DESKTOP: NARRATIVE FLOW description -> diagram */}
        {!user && <NarrativeFlowLines />}
      </div>
    </ParticleBackground >
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
