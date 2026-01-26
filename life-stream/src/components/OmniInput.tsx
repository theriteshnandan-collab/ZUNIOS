"use client";

import { useState, useEffect, useRef } from "react";
import { predictMode } from "@/lib/auto-classifier";
import { EntryMode, MODE_LABELS } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Sparkles, Mic, Eye, Zap, Target, Brain, Wand2, ArrowRight } from "lucide-react";
import { getTemplatesForCategory, EntryTemplate } from "@/lib/entry-templates";
import { motion, AnimatePresence } from "framer-motion";

// Mode configuration with new persona labels
const MODE_CONFIG = {
    dream: { icon: Eye, label: MODE_LABELS.dream.name, color: 'text-purple-400' },      // Vision
    idea: { icon: Zap, label: MODE_LABELS.idea.name, color: 'text-amber-400' },         // Build
    win: { icon: Target, label: MODE_LABELS.win.name, color: 'text-emerald-400' },      // Log
    journal: { icon: Brain, label: MODE_LABELS.journal.name, color: 'text-blue-400' },  // Think
    thought: { icon: Brain, label: MODE_LABELS.thought.name, color: 'text-white' }      // Think (default)
};

interface OmniInputProps {
    onAnalyze: (text: string, mode: EntryMode) => void;
    isAnalyzing: boolean;
    initialMode?: EntryMode;
}

export default function OmniInput({ onAnalyze, isAnalyzing, initialMode = 'thought' }: OmniInputProps) {
    const [text, setText] = useState("");
    const [predictedMode, setPredictedMode] = useState<EntryMode>(initialMode);
    const [showTemplates, setShowTemplates] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        // Force height update
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

    return (
        <div className="w-full relative z-50">
            {/* Input Card Container - With Overflow Hidden for clean corners */}
            <div className={cn(
                "relative bg-white/5 border border-white/10 rounded-[28px] overflow-hidden transition-all duration-300 backdrop-blur-sm",
                "focus-within:bg-white/10 focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10",
                isAnalyzing && "opacity-50 pointer-events-none"
            )}>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Capture your stream of consciousness..."
                    className="w-full bg-transparent text-lg text-white placeholder:text-white/20 p-6 min-h-[120px] outline-none resize-none font-light leading-relaxed scrollbar-hide"
                    disabled={isAnalyzing}
                />

                {/* Bottom Bar */}
                <div className="flex items-center justify-between px-4 pb-4">
                    {/* Mode Indicator & Tools */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 transition-colors",
                            activeModeConfig.color
                        )}>
                            <activeModeConfig.icon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium uppercase tracking-wider">{activeModeConfig.label}</span>
                        </div>

                        {/* Template Trigger */}
                        {templates.length > 0 && !text && (
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 transition-colors text-xs font-medium",
                                    showTemplates ? "bg-white/10 text-white" : "bg-black/20 text-white/50 hover:text-white"
                                )}
                            >
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>Templates</span>
                            </button>
                        )}

                        {text.length > 5 && (
                            <span className="text-[10px] text-white/20 animate-in fade-in slide-in-from-left-2">
                                Auto-detecting...
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-full text-white/50 hover:bg-white/10 hover:text-white"
                        >
                            <Mic className="w-5 h-5" />
                        </Button>
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
                                    ? "bg-white text-black hover:bg-white/90 hover:scale-105"
                                    : "bg-white/5 text-white/20"
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
            </div>

            {/* Templates Dropdown - Outside overflow-hidden container */}
            <AnimatePresence>
                {showTemplates && templates.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-full max-w-sm bg-gray-900/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl z-20 overflow-hidden"
                    >
                        <div className="p-2 space-y-1">
                            {templates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-left transition-colors group"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">{template.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-white">{template.title}</p>
                                        <p className="text-xs text-white/40 line-clamp-1">{template.prompt}</p>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-white/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
