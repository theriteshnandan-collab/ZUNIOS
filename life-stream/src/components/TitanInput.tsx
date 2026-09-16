"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { predictMode } from "@/lib/auto-classifier";
import { EntryMode, MODE_LABELS } from "@/lib/theme-config";
import { Sparkles, Eye, Zap, Target, Brain, ArrowUp, Plus, Mic, MicOff, ArrowRight } from "lucide-react";
import { getTemplatesForCategory, EntryTemplate } from "@/lib/entry-templates";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mode configuration — strict monochrome
const MODE_CONFIG: Record<EntryMode, { icon: React.ElementType; label: string; color: string; badge: string }> = {
    thought: { icon: Brain,  label: MODE_LABELS.thought.name, color: 'text-zinc-400', badge: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-300' },
    idea:    { icon: Zap,    label: MODE_LABELS.idea.name,    color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
    win:     { icon: Target, label: MODE_LABELS.win.name,     color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
    dream:   { icon: Eye,    label: MODE_LABELS.dream.name,   color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
    journal: { icon: Brain,  label: MODE_LABELS.journal.name, color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
};

const MODES_LIST: EntryMode[] = ['thought', 'idea', 'win', 'dream'];

interface TitanInputProps {
    onAnalyze: (text: string, mode: EntryMode) => void;
    isAnalyzing: boolean;
    initialMode?: EntryMode;
    initialValue?: string;
}

export default function TitanInput({
    onAnalyze,
    isAnalyzing,
    initialMode = 'thought',
    initialValue = ''
}: TitanInputProps) {
    const [text, setText] = useState(initialValue);
    const [predictedMode, setPredictedMode] = useState<EntryMode>(initialMode);
    const [isFocused, setIsFocused] = useState(false);
    const [isActivated, setIsActivated] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRec) {
                const rec = new SpeechRec();
                rec.continuous = false;
                rec.interimResults = true;
                rec.lang = "en-US";

                rec.onstart = () => {
                    setIsListening(true);
                    toast.info("Voice stream active — speaking to consciousness...", { id: "voice-toast" });
                };

                rec.onend = () => {
                    setIsListening(false);
                };

                rec.onresult = (event: any) => {
                    let transcript = "";
                    for (let i = 0; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    if (transcript) {
                        setText((prev) => {
                            const trimmed = prev.trim();
                            return trimmed ? `${trimmed} ${transcript}` : transcript;
                        });
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 800);
                    }
                };

                rec.onerror = (event: any) => {
                    setIsListening(false);
                    if (event.error === 'not-allowed') {
                        toast.error("Microphone permission denied. Enable microphone access.");
                    } else if (event.error !== 'no-speech') {
                        console.warn("Speech recognition notice:", event.error);
                    }
                };

                recognitionRef.current = rec;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.warn("Speech recognition start failed:", e);
            }
        }
    };

    useEffect(() => {
        const handleFocusTitan = () => {
            if (textareaRef.current) {
                textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.focus();
                        textareaRef.current.setSelectionRange(
                            textareaRef.current.value.length,
                            textareaRef.current.value.length
                        );
                    }
                }, 150);
                setIsFocused(true);
                setIsActivated(true);
                setTimeout(() => setIsActivated(false), 2000);
            }
        };

        window.addEventListener("focus-titan-input", handleFocusTitan);
        return () => {
            window.removeEventListener("focus-titan-input", handleFocusTitan);
        };
    }, []);

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

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim() && !isAnalyzing) {
                onAnalyze(text.trim(), predictedMode);
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
    const placeholder = "What is emerging in your mind?";

    return (
        <div className="w-full relative z-50 flex flex-col items-center">
            {/* Ambient Underglow */}
            <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                initial={{ opacity: 0.1, width: "35%" }}
                animate={{
                    opacity: (isFocused || isActivated || isListening) ? 0.45 : 0.15,
                    width: (isFocused || isActivated || isListening) ? "80%" : "35%",
                    height: (isFocused || isActivated || isListening) ? "90px" : "45px"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 35 }}
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: isListening 
                            ? "linear-gradient(90deg, rgba(239,68,68,0.3) 0%, rgba(255,255,255,0.6) 50%, rgba(59,130,246,0.3) 100%)" 
                            : "linear-gradient(90deg, rgba(200,200,210,0.25) 0%, rgba(255,255,255,0.55) 50%, rgba(180,180,200,0.25) 100%)",
                        filter: "blur(65px)",
                    }}
                />
            </motion.div>

            {/* === DOUBLE-BEZEL HARDWARE SHELL === */}
            <motion.div
                className={cn(
                    "w-full relative p-1.5 rounded-[32px] transition-all duration-500",
                    "bg-white/[0.04] border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl",
                    (isFocused || isActivated) && "border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.12)] ring-1 ring-white/20",
                    isListening && "border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]",
                    isAnalyzing && "opacity-50 pointer-events-none"
                )}
                layout
            >
                {/* === INNER CORE CONTAINER === */}
                <div className="relative rounded-[calc(32px-0.375rem)] bg-zinc-950/85 border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)] overflow-hidden">
                    {/* Subtle Grain Overlay */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <div className="relative z-10 flex items-center gap-2.5 px-4 py-3 min-h-[64px]">
                        {/* Templates / Inspiration Button */}
                        <button 
                            type="button"
                            onClick={() => setShowTemplates(!showTemplates)}
                            title="Inspiration Templates"
                            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus className={cn("w-5 h-5 transition-transform duration-300", showTemplates && "rotate-45")} />
                        </button>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            id="titan-textarea"
                            value={text}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            className={cn(
                                "flex-1 bg-transparent py-2 !outline-none !border-none !shadow-none focus:ring-0 focus:shadow-none resize-none",
                                "text-base text-white placeholder:text-zinc-500",
                                "font-light leading-relaxed",
                                "scrollbar-hide"
                            )}
                            rows={1}
                            disabled={isAnalyzing}
                        />

                        {/* Right Interactive Tools */}
                        <div className="flex items-center gap-2 self-end pb-1">
                            {/* Voice Dictation Button */}
                            <button
                                type="button"
                                onClick={toggleListening}
                                title={isListening ? "Listening... Click to stop" : "Start Voice Input"}
                                className={cn(
                                    "p-2 rounded-full transition-all duration-300 active:scale-90 cursor-pointer relative",
                                    isListening
                                        ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"
                                        : "hover:bg-white/10 text-white/50 hover:text-white"
                                )}
                            >
                                {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                                {isListening && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                )}
                            </button>

                            {/* Submit Button (Button-in-Button Physics) */}
                            <Button
                                size="icon"
                                onClick={() => {
                                    if (text.trim() && !isAnalyzing) {
                                        onAnalyze(text.trim(), predictedMode);
                                        setText("");
                                    }
                                }}
                                disabled={!text.trim() || isAnalyzing}
                                className={cn(
                                    "h-9 w-9 rounded-full transition-all duration-300 group cursor-pointer",
                                    text.trim()
                                        ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:bg-zinc-200 active:scale-[0.92]"
                                        : "bg-white/10 text-white/40 opacity-60 hover:opacity-100 hover:bg-white/20 active:scale-[0.95]"
                                )}
                            >
                                {isAnalyzing ? (
                                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                                ) : (
                                    <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mode Selector & Status Footer Bar */}
                    <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between gap-2">
                        {/* Mode Switcher Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                            {MODES_LIST.map((m) => {
                                const cfg = MODE_CONFIG[m];
                                const isCurrent = predictedMode === m;
                                const Icon = cfg.icon;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPredictedMode(m)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-tight transition-all duration-200 cursor-pointer",
                                            isCurrent
                                                ? cn("border shadow-sm", cfg.badge)
                                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] border border-transparent"
                                        )}
                                    >
                                        <Icon className={cn("w-3 h-3", isCurrent ? cfg.color : "text-zinc-600")} />
                                        <span>{cfg.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Keyboard Helper */}
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-600 font-mono select-none">
                            <span>Press</span>
                            <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/10 text-zinc-400">↵</kbd>
                            <span>to think</span>
                        </div>
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
                            "bg-white/[0.10] backdrop-blur-xl",
                            "border border-white/20 rounded-xl",
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
