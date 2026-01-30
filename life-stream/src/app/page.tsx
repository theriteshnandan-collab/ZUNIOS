"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Moon, Sparkles, Lightbulb, Target, BrainCircuit, Zap } from "lucide-react";
import OmniInput from "@/components/OmniInput";
import { cn } from "@/lib/utils";
import { useMode } from "@/components/ModeProvider";
import { EntryMode } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import DreamLoader from "@/components/DreamLoader";
import DreamImage from "@/components/DreamImage";
import confetti from "canvas-confetti";
import LandingSections from "@/components/marketing/LandingSections";
import ZuniosLogo from "@/components/ZuniosLogo";
import { useTaskStore } from "@/stores/taskStore";
import { useAppBadge } from "@/hooks/useAppBadge";
import { parseCommandLocally } from "@/lib/local-intelligence";

function HomeContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<any>(null);

  // MODE STATE (Global)
  const { mode, setMode } = useMode();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const addTask = useTaskStore((state) => state.addTask);
  const tasks = useTaskStore((state) => state.tasks);
  const incompleteCount = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;

  // 🔴 BRICK W5: THE RED DOT
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
  // Detects ?mode=X from PWA Shortcuts and sets the state.
  useEffect(() => {
    const shortcutMode = searchParams.get('mode');
    if (shortcutMode && ['task', 'idea', 'journal', 'dream', 'thought'].includes(shortcutMode)) {
      // Map 'task' to appropriate internal mode if needed, or just set it.
      // Note: 'task' isn't a visual mode in EntryMode yet, but we treat it as specialized input.
      // For now, map 'task' to 'thought' but with a special flag, or just focus.

      const targetMode = shortcutMode === 'task' ? 'thought' : (shortcutMode as EntryMode);
      setMode(targetMode);

      // Auto-focus logic can be handled by OmniInput observing mode changes
      // or we can pass a 'autoFocus' prop. 
      // For now, setting mode is the key step.

      // Clean URL
      router.replace('/', { scroll: false });
      toast.info(`Mode set to: ${shortcutMode.toUpperCase()}`);
    }
  }, [searchParams, setMode, router]);

  const getModeData = () => {
    switch (mode) {
      case 'idea': return {
        title: "Build Something Great",
        icon: Lightbulb
      };
      case 'win': return {
        title: "Log Your Moment",
        icon: Sparkles
      };
      case 'journal':
      case 'thought': return {
        title: "Think It Through",
        icon: BrainCircuit
      };
      default: return {
        title: "Explore Your Vision",
        icon: Moon
      };
    }
  };

  const handleAnalyze = async (text: string, analysisMode: EntryMode) => {
    setIsLoading(true);
    try {
      // 🔀 COMMAND ROUTER (THE "EAR" OF ZUNIOS)
      // Detects intent to create a task via specific keywords or phrasings.
      const commandRegex = /^\s*(?:(add|create|new|plus|log|record|setup|schedule|deploy|execute|start)\s+(?:a\s+)?(task|todo|to-do|mission|reminder|op|operation|objective|entry)|(?:task|todo|to-do|mission|remind|reminder|op|operation|objective)|(?:remind|remember|don't\s+forget)(?:\s+me)?\s+to|(?:urgent|priority|important|p[1-3]):|i\s+(?:need|have|must)\s+to)\b/i;

      if (commandRegex.test(text)) {
        console.log("🚀 Command Detected: Routing to Task Engine");

        let taskData;

        try {
          // ☁️ TRY CLOUD INTELLIGENCE
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
          // 🛡️ CIRCUIT BREAKER: FALLBACK TO LOCAL
          console.warn("Cloud Intelligence Failed. Engaging Local Protocols.", err);
          taskData = parseCommandLocally(text);
          toast("Offline Intelligence Active", {
            description: "Cloud unreachable. Processed locally.",
            icon: <Zap className="w-4 h-4 text-amber-400" />
          });
        }

        // ACTUALLY CREATE THE TASK
        if (taskData.action === 'create' && taskData.data) {
          await addTask({
            content: taskData.data.content,
            priority: (taskData.data.priority?.toLowerCase() as any) || 'medium',
            due_date: taskData.data.due_date,
          });
        }

        // Success - Task Created
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        toast.success(
          taskData.action === 'create' ? "Mission Deployed" : "Command Executed",
          { description: taskData.data?.content || "Operation successful" }
        );

        // Do NOT show revelation view for tasks. 
        // Just clear loading state.
        setIsLoading(false);
        return;
      }

      // 🔮 STANDARD ANALYSIS (Dream/Journal)
      let analysisResult;

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dream: text, category: analysisMode })
        });

        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        analysisResult = data;

      } catch (err) {
        // 🛡️ CIRCUIT BREAKER: DREAM FALLBACK
        console.warn("Dream Analysis Failed. Engaging Local Save.", err);
        analysisResult = {
          theme: "Raw Entry",
          mood: "Neutral",
          imageUrl: "/placeholder-dream.jpg", // Needs a valid fallback or handling
          interpretation: ["Cloud analysis unavailable. Entry saved safely."],
          content: text
        };
        toast("Offline Save Active", {
          description: "Analysis skipped. Content preserved.",
          icon: <Zap className="w-4 h-4 text-amber-400" />
        });
      }

      // Merge original text content so it can be saved later
      setResult({ ...analysisResult, content: text });
    } catch (error: any) {
      console.error("Critical Failure:", error);
      toast.error("System Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const modeData = getModeData();

    // GUEST HANDLING
    if (!user) {
      try {
        const guestDream = {
          id: crypto.randomUUID(),
          content: result.content,
          theme: result.theme,
          mood: result.mood,
          image_url: result.imageUrl,
          category: mode,
          created_at: new Date().toISOString(),
          is_guest: true,
          interpretation: result.interpretation // Persist interpretation
        };

        const existing = JSON.parse(localStorage.getItem('guest_dreams') || '[]');
        const updated = [guestDream, ...existing];
        localStorage.setItem('guest_dreams', JSON.stringify(updated));

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        toast.success(`Saved to Temporary Notebook! 📝`, {
          description: "Sign in to save permanently.",
          duration: 5000,
        });

        setResult(null);
      } catch (error) {
        console.error("Guest save failed:", error);
        toast.error("Failed to save locally.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // AUTH MODE SAVE
    setIsSaving(true);
    try {
      const response = await fetch('/api/entries/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: result.content,
          theme: result.theme,
          mood: result.mood,
          image_url: result.imageUrl,
          category: mode,
          user_id: user.id,
          interpretation: result.interpretation
        })
      });

      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server connection failed (${response.status}): ${responseText.substring(0, 100)}...`);
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
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 w-full max-w-6xl flex flex-col md:grid md:grid-cols-[450px_1fr] gap-8 items-start"
        >
          {/* Image Side - Cinematic Size */}
          <div className="relative group w-full md:w-[450px] shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-3xl blur-2xl opacity-20 group-hover:opacity-50 transition duration-1000" />
            <div className="relative rounded-2xl shadow-2xl w-full aspect-square md:h-[450px] overflow-hidden bg-black/50 border border-white/10">
              <DreamImage
                src={result.imageUrl}
                alt="Visualization"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Analysis Side */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold font-serif tracking-tight leading-tight">{result.theme}</h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                {result.mood}
              </div>
            </div>

            <div className="space-y-4">
              {(Array.isArray(result.interpretation) ? result.interpretation : [result.interpretation || "Analysis unavailable"]).map((item: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <p className="text-slate-300 leading-relaxed text-lg font-light">{item}</p>
                </motion.div>
              ))}

              {/* ZUNIOS Signature */}
              <div className="text-right pt-2">
                <span className="text-sm text-white/30 italic tracking-widest">— ZUNIOS</span>
              </div>
            </div>

            {/* Guest Warning */}
            {!user && (
              <GlassCard className="p-4 mb-6 border-amber-500/30 bg-amber-500/5">
                <div className="flex flex-col gap-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-200/90 font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Sign in to save this</span>
                  </div>
                  <p className="text-xs text-amber-200/60">
                    Create a free account to keep a permanent record.
                  </p>
                  <SignInButton mode="modal">
                    <Button variant="secondary" className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-100 border border-amber-500/20">
                      Sign In Now
                    </Button>
                  </SignInButton>
                </div>
              </GlassCard>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                {isSaving ? (
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save to Zunios"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="flex-1 hover:bg-white/5"
              >
                Discard
              </Button>
            </div>
          </div>
        </motion.div >
      </div >
    );
  }

  // INPUT VIEW
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col items-center justify-center p-4 relative">
      {isLoading && <DreamLoader mode={mode} />}

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-2xl text-center space-y-8"
      >

        {/* Header - Hide large text in sidebar mode */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6 scale-125">
            <ZuniosLogo size="xl" showText={true} className="flex-col !gap-4" />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold font-serif tracking-tight bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent pb-2 hidden sm:block">
            The OS for <br /> Your Mind
          </h1>

          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed hidden sm:block">
            Capture visions. Build ideas. Log moments. Think deeply. <br />
            Your second brain, evolved.
          </p>
        </div>

        {/* Input Card - Replaced by Omnibar */}
        <div className="w-full max-w-2xl mx-auto">
          <OmniInput
            onAnalyze={handleAnalyze}
            isAnalyzing={isLoading}
            initialMode={mode}
            initialValue={searchParams.get('content') || ''}
          />
        </div>


      </motion.div>

      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full hidden sm:block" // Brick W9: Hide landing page in sidebar mode
        >
          <LandingSections />
        </motion.div>
      )}
    </div>
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
