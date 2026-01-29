"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sparkles, Lightbulb, Target, BrainCircuit } from "lucide-react";
import OmniInput from "@/components/OmniInput";
import { useMode } from "@/components/ModeProvider";
import { EntryMode } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUser, SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";
import DreamLoader from "@/components/DreamLoader";
import DreamImage from "@/components/DreamImage";
import confetti from "canvas-confetti";
import LandingSections from "@/components/marketing/LandingSections";
import ZuniosLogo from "@/components/ZuniosLogo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<any>(null);

  // MODE STATE (Global)
  const { mode } = useMode();
  const { user } = useUser();
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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: text, category: analysisMode })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Merge original text content so it can be saved later
      setResult({ ...data, content: text });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to analyze. Please try again.");
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

      const data = await response.json();

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
          className="z-10 w-full max-w-4xl flex flex-col md:grid md:grid-cols-[280px_1fr] gap-6 items-start"
        >
          {/* Image Side - Controlled Size */}
          <div className="relative group w-full md:w-[280px] shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative rounded-xl shadow-2xl w-full aspect-square md:aspect-auto md:h-[280px] overflow-hidden bg-black/50">
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
              <h2 className="text-3xl font-bold font-serif tracking-tight">{result.theme}</h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {result.mood}
              </div>
            </div>

            <div className="space-y-3">
              {result.interpretation?.map((item: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Brick 9: The Streak Flame */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                      <Flame className={cn("w-4 h-4 text-orange-500 fill-orange-500", streak > 0 ? "animate-fire" : "opacity-50")} />
                      <span className="text-xs font-medium text-orange-200">
                        {streak} Day Streak
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base">{item}</p>
                </motion.div>
              ))}

              {/* ZUNIOS Signature */}
              <div className="text-right pt-2">
                <span className="text-sm text-white/30 italic">— ZUNIOS</span>
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

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6 scale-125">
            <ZuniosLogo size="xl" showText={true} className="flex-col !gap-4" />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold font-serif tracking-tight bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent pb-2">
            The OS for <br /> Your Mind
          </h1>

          <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
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
          />
        </div>


      </motion.div>

      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full"
        >
          <LandingSections />
        </motion.div>
      )}
    </div>
  );
}
