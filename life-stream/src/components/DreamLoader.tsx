"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EntryMode } from "@/lib/theme-config";

interface DreamLoaderProps {
    mode?: EntryMode;
}

export default function DreamLoader({ mode = 'dream' }: DreamLoaderProps) {
    const [text, setText] = useState("");
    const [phaseIndex, setPhaseIndex] = useState(0);

    const steps = [
        "INITIALIZING NEURAL INTERFACE...",
        `CONNECTING TO ${mode.toUpperCase()} MATRIX...`,
        "DECRYPTING SYMBOLS...",
        "PATTERN MATCHING [████████░░] 80%",
        "SYNTHESIZING OUTPUT...",
    ];

    useEffect(() => {
        let currentStep = 0;
        let charIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const typeNextChar = () => {
            const currentString = steps[currentStep];
            if (charIndex < currentString.length) {
                setText(currentString.slice(0, charIndex + 1));
                charIndex++;
                timeoutId = setTimeout(typeNextChar, 30); // Typing speed
            } else {
                // Pause at end of line
                timeoutId = setTimeout(() => {
                    currentStep = (currentStep + 1) % steps.length;
                    charIndex = 0;
                    setText(""); // Clear for next line
                    typeNextChar();
                }, 1500); // 1.5s pause
            }
        };

        typeNextChar();

        return () => clearTimeout(timeoutId);
    }, [mode]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl font-mono">
            {/* Hexagon Grid Background Logic would go here, simplified for now */}

            <div className="w-full max-w-md p-8 border border-green-500/30 bg-black rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
                {/* Scanline */}
                <motion.div
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-green-500/50 shadow-[0_0_10px_#22c55e] z-10"
                />

                {/* Glitch Overlay */}
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-[0.03] pointer-events-none mix-blend-screen bg-cover" />

                <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-end border-b border-green-900/50 pb-2">
                        <span className="text-xs text-green-700">SYS.PROCESS.ID.{Math.floor(Math.random() * 9999)}</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-green-500/50 rounded-full" />
                            <div className="w-2 h-2 bg-green-500/20 rounded-full" />
                        </div>
                    </div>

                    <div className="min-h-[60px] flex items-center">
                        <p className="text-green-500 font-bold text-lg tracking-wider typing-cursor">
                            {'>'} {text}<span className="animate-blink">_</span>
                        </p>
                    </div>

                    <div className="h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                            className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-green-800">
                        <div>CPU: {Math.floor(Math.random() * 30 + 30)}%</div>
                        <div className="text-center">MEM: {Math.floor(Math.random() * 40 + 40)}GB</div>
                        <div className="text-right">NET: SECURE</div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .typing-cursor::after {
                    content: '';
                    display: inline-block;
                    width: 6px;
                    height: 16px;
                    background-color: #22c55e;
                    margin-left: 4px;
                    animation: blink 0.8s infinite;
                    vertical-align: middle;
                }
                @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
