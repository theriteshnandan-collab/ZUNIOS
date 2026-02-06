"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { predictMode } from "@/lib/auto-classifier";
import { EntryMode, MODE_LABELS } from "@/lib/theme-config";
import { Send, Sparkles, Eye, Zap, Target, Brain, Wand2, ArrowRight, Mic, MicOff } from "lucide-react";
import { getTemplatesForCategory, EntryTemplate } from "@/lib/entry-templates";
import { Button } from "@/components/ui/button";
import { useVoiceInput } from "@/hooks/useVoiceInput";

// Mode configuration with Titan-aligned colors
const MODE_CONFIG = {
    dream: { icon: Eye, label: MODE_LABELS.dream.name, color: 'text-violet-400' },
    idea: { icon: Zap, label: MODE_LABELS.idea.name, color: 'text-amber-400' },
    win: { icon: Target, label: MODE_LABELS.win.name, color: 'text-emerald-400' },
    journal: { icon: Brain, label: MODE_LABELS.journal.name, color: 'text-blue-400' },
    thought: { icon: Brain, label: MODE_LABELS.thought.name, color: 'text-zinc-300' }
};

interface TitanInputProps {
    onAnalyze: (text: string, mode: EntryMode) => void;
    isAnalyzing: boolean;
    initialMode?: EntryMode;
    initialValue?: string;
}

/**
 * TitanInput V2
 * 
 * The "Super Pill" input with:
 * - Breathing underglow (idle)
 * - Expanded glow on focus
 * - Faster pulse when typing
 */
export default function TitanInput({
    onAnalyze,
    isAnalyzing,
    initialMode = 'thought',
    initialValue = ''
}: TitanInputProps) {
    const [text, setText] = useState(initialValue);
    const [predictedMode, setPredictedMode] = useState<EntryMode>(initialMode);
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Voice Input Integration
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasSupport } = useVoiceInput();

    // Sync Voice Transcript with Text
    // Sync Voice Transcript with Text
    useEffect(() => {
        if (transcript) {
            setText(prev => {
                // Simple append logic for now
                // We need to be careful: transcript updates continuously.
                // If we append `transcript` every time it updates, we'll duplicate text.
                // WEIRDNESS: react-speech-recognition usually gives the FULL transcript of the session.
                // So replacing might be correct IF we are in "Voice Mode" only.
                // But mixed mode is better.

                // Better approach: When transcript updates, we only want the *diff* or just trust the user
                // to not type while speaking.
                // Actually, let's keep it simple: If isListening, text = initialTextBeforeRecording + transcript.
                return prev;
            });
        }
    }, [transcript]);

    // Refined Logic (Need state to hold text before recording started)
    const [textBeforeRecording, setTextBeforeRecording] = useState("");

    useEffect(() => {
        if (isListening) {
            setTextBeforeRecording(text);
        } else {
            // When stopping, finalized text is already in `text`
        }
    }, [isListening]);

    useEffect(() => {
        if (isListening && transcript) {
            // text = (what was there) + (space) + (current transcript)
            const spacer = textBeforeRecording && !textBeforeRecording.endsWith(' ') ? ' ' : '';
            setText(`${textBeforeRecording}${spacer}${transcript}`);
            setIsTyping(true);
        }
    }, [transcript, isListening, textBeforeRecording]);

    useEffect(() => {
        setPredictedMode(initialMode);
    }, [initialMode]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [text]);

    // Live Prediction
    useEffect(() => {
        if (text.length > 5 && !showTemplates) {
            const prediction = predictMode(text);
            if (prediction !== predictedMode) {
                setPredictedMode(prediction);
            }
        }
    }, [text, predictedMode, showTemplates]);

    // Typing detection for glow pulse
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setIsTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing state after 500ms of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (text.trim()) {
                onAnalyze(text, predictedMode);
                setText("");
            }
        }
    };

    const handleTemplateSelect = (template: EntryTemplate) => {
        setText(template.prompt);
        setPredictedMode(template.category);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
                textareaRef.current.focus();
            }
        }, 10);
        setShowTemplates(false);
    };

    const activeModeConfig = MODE_CONFIG[predictedMode] || MODE_CONFIG.thought;
    const templates = getTemplatesForCategory(predictedMode);

    // Typewriter placeholder
    const [placeholder, setPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    const PLACEHOLDERS = [
        "What's on your mind?",
        "Describe your vision...",
        "Log a moment...",
        "Share an idea..."
    ];

    useEffect(() => {
        const currentText = PLACEHOLDERS[placeholderIndex];

        if (charIndex < currentText.length) {
            const timeout = setTimeout(() => {
                setPlaceholder(prev => prev + currentText[charIndex]);
                setCharIndex(prev => prev + 1);
            }, 50 + Math.random() * 30);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setPlaceholder("");
                setCharIndex(0);
                setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, placeholderIndex]);

    // Glow animation speed based on state
    const glowAnimationDuration = isListening ? "1s" : isTyping ? "1.5s" : isFocused ? "3s" : "4s";

    const getGlowGradient = () => {
        if (isListening) return "linear-gradient(90deg, #ef4444 0%, #fca5a5 50%, #b91c1c 100%)"; // Red (Recording)
        return "linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, rgba(249, 115, 22, 0.4) 50%, rgba(59, 130, 246, 0.5) 100%)";
    };

    return (
        <div className="w-full relative z-50">
            {/* === THE TITAN GLOW (Underglow) === */}
            <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                initial={{ opacity: 0.4, width: "50%" }}
                animate={{
                    opacity: isFocused ? 0.7 : 0.4,
                    width: isFocused ? "70%" : "50%",
                    height: isFocused ? "80px" : "50px"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: getGlowGradient(),
                        filter: "blur(40px)",
                        animation: `titan-breathe ${glowAnimationDuration} ease-in-out infinite`
                    }}
                />
            </motion.div>

            {/* === THE TITAN CONTAINER === */}
            <motion.div
                className={cn(
                    "relative overflow-hidden rounded-[28px]",
                    "bg-[#0a0a0c]/90 backdrop-blur-2xl",
                    // Inner Light Effect (top edge)
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
                    // Subtle border
                    "border border-white/[0.06]",
                    "transition-all duration-300",
                    isFocused && "border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
                    isAnalyzing && "opacity-50 pointer-events-none"
                )}
                layout
            >
                {/* Noise Texture */}
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        opacity: 0.04
                    }}
                />

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "relative z-10 w-full bg-transparent",
                        "text-lg text-zinc-200 placeholder:text-zinc-600",
                        "p-6 min-h-[100px] outline-none resize-none",
                        "font-light leading-relaxed",
                        "scrollbar-hide"
                    )}
                    disabled={isAnalyzing}
                />

                {/* Bottom Toolbar */}
                <div className="relative z-10 flex items-center justify-between px-4 pb-4">
                    {/* Mode Indicator & Tools */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        <motion.div
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full",
                                "bg-white/[0.04] border border-white/[0.06]",
                                "transition-colors",
                                activeModeConfig.color
                            )}
                            layout
                        >
                            <activeModeConfig.icon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium uppercase tracking-wider">
                                {activeModeConfig.label}
                            </span>
                        </motion.div>

                        {/* Template Trigger */}
                        {templates.length > 0 && !text && (
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                                    "border border-white/[0.06] transition-colors text-xs font-medium",
                                    showTemplates
                                        ? "bg-white/[0.08] text-white"
                                        : "bg-white/[0.03] text-zinc-500 hover:text-white"
                                )}
                            >
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>Templates</span>
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Voice Button (VOX) */}
                        {hasSupport && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    if (isListening) {
                                        stopListening();
                                    } else {
                                        // Clear previous transcript so we don't append old text
                                        resetTranscript();
                                        startListening();
                                    }
                                }}
                                className={cn(
                                    "h-9 w-9 rounded-full transition-all duration-300",
                                    isListening
                                        ? "text-red-400 bg-red-500/10 animate-pulse hover:bg-red-500/20"
                                        : "text-zinc-500 hover:text-white hover:bg-white/[0.05]"
                                )}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                        )}

                        {/* Submit Button */}
                        <Button
                            size="icon"
                            onClick={() => {
                                if (text.trim()) {
                                    onAnalyze(text, predictedMode);
                                    setText("");
                                }
                            }}
                            disabled={!text.trim() || isAnalyzing}
                            className={cn(
                                "h-10 w-10 rounded-full transition-all duration-300",
                                text.trim()
                                    ? "bg-white text-black hover:bg-zinc-200 hover:scale-105"
                                    : "bg-white/[0.05] text-zinc-600"
                            )}
                        >
                            {isAnalyzing ? (
                                <Sparkles className="w-5 h-5 animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Templates Dropdown */}
            <AnimatePresence>
                {showTemplates && templates.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={cn(
                            "absolute top-full left-0 mt-3 w-auto min-w-[240px] max-w-[90vw]",
                            "bg-[#0a0a0c]/95 backdrop-blur-xl",
                            "border border-white/[0.06] rounded-xl",
                            "shadow-2xl shadow-black/50",
                            "z-[100] overflow-hidden"
                        )}
                    >
                        <div className="p-1.5 space-y-0.5">
                            {templates.map(template => (
                                <button
                                    key={template.id}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleTemplateSelect(template);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2.5 rounded-lg",
                                        "hover:bg-white/[0.05] active:bg-white/[0.08]",
                                        "text-left transition-all group cursor-pointer"
                                    )}
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform">
                                        {template.icon}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                            {template.title}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
