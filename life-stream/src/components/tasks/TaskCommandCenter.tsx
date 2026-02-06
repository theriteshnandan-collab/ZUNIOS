"use client";

import { useState } from "react";
import { Terminal, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TaskCommandCenterProps {
    onCommandExecuted: (result: any) => void;
}

export default function TaskCommandCenter({ onCommandExecuted }: TaskCommandCenterProps) {
    const [command, setCommand] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim() || isProcessing) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/analyze-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Audio Feedback (Tactile)
            // const audio = new Audio('/sounds/click.mp3');
            // audio.play().catch(() => {});

            toast.success("Command Executed", {
                description: `Action: ${data.action.toUpperCase()} | ${data.data.content}`,
                icon: <Terminal className="w-4 h-4 text-green-400" />
            });

            onCommandExecuted(data);
            setCommand("");
        } catch (error) {
            console.error("Command failed:", error);
            toast.error("Command Failed", {
                description: "Mission Control could not parse instructions."
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-20">
            <div className="relative group">
                {/* Glow Effect (Aether: Cyan/Blue) */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                <form
                    onSubmit={handleCommand}
                    className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-all duration-300 focus-within:ring-1 focus-within:ring-white/20 focus-within:bg-black/60"
                >
                    {/* Identifier Icon */}
                    <div className="pl-3 pr-3 text-white/50 border-r border-white/5 h-6 flex items-center">
                        <Terminal className="w-4 h-4" />
                    </div>

                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter mission orders... (e.g. 'Finish Lab Report tomorrow high priority')"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 h-10 px-4 font-mono text-sm"
                        disabled={isProcessing}
                        autoComplete="off"
                    />

                    {/* Action Button */}
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isProcessing || !command.trim()}
                        className={cn(
                            "h-8 px-3 ml-2 transition-all duration-300",
                            isProcessing ? "bg-white/5 text-white/50" : "bg-white/10 hover:bg-white/20 text-white"
                        )}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ArrowRight className="w-4 h-4" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
