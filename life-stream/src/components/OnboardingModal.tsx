"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen, Target, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

const ONBOARDING_KEY = "zunios_onboarding_complete";

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
        if (!hasSeenOnboarding) {
            // Small delay for smoother experience
            setTimeout(() => setIsOpen(true), 1000);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setIsOpen(false);
    };

    const handleSkip = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setIsOpen(false);
    };

    const steps = [
        {
            icon: Sparkles,
            title: "Welcome to Zunios",
            description: "The operating system for your mind. Capture thoughts, visions, and wins—all in one place.",
            color: "text-purple-400"
        },
        {
            icon: Moon,
            title: "Record Visions",
            description: "Log your dreams, ideas, and subconscious patterns. Our AI helps you decode their meaning.",
            color: "text-indigo-400"
        },
        {
            icon: Target,
            title: "Track Progress",
            description: "Build streaks, earn XP, and watch your second brain evolve over time.",
            color: "text-emerald-400"
        },
        {
            icon: BookOpen,
            title: "Your Journal Awaits",
            description: "Everything is saved securely. Start capturing your consciousness today.",
            color: "text-amber-400"
        }
    ];

    const currentStep = steps[step];
    const Icon = currentStep.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <GlassCard gradient className="p-8 text-center relative">
                            {/* Skip button */}
                            <button
                                onClick={handleSkip}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                key={step}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                                className="mx-auto mb-6"
                            >
                                <div className={`w-20 h-20 rounded-full bg-white/10 flex items-center justify-center ${currentStep.color}`}>
                                    <Icon className="w-10 h-10" />
                                </div>
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                key={`content-${step}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-white mb-3">
                                    {currentStep.title}
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    {currentStep.description}
                                </p>
                            </motion.div>

                            {/* Progress dots */}
                            <div className="flex justify-center gap-2 mb-6">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setStep(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === step
                                                ? "w-6 bg-primary"
                                                : "bg-white/20 hover:bg-white/40"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {step > 0 && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setStep(s => s - 1)}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                )}
                                {step < steps.length - 1 ? (
                                    <Button
                                        onClick={() => setStep(s => s + 1)}
                                        className="flex-1 bg-primary hover:bg-primary/90"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleComplete}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                                    >
                                        Get Started 🚀
                                    </Button>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
