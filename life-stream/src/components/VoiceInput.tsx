"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    className?: string;
}

export default function VoiceInput({ onTranscript, className }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // checks for browser support
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = "en-US";

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                    toast.info("Listening...", { id: "voice-status" });
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) {
                        onTranscript(transcript);
                        toast.success("Voice captured!");
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.warn("Speech recognition warning:", event.error); // Warn instead of Error to avoid console noise
                    setIsListening(false);
                    if (event.error === 'not-allowed') {
                        toast.error("Microphone access denied. Please allow permission.");
                    } else if (event.error === 'network') {
                        toast.error("Voice requires an active internet connection.");
                    } else if (event.error === 'no-speech') {
                        // Ignore no-speech, just stop listening
                        return;
                    } else {
                        toast.error("Could not hear you. Try again.");
                    }
                };
            } else {
                setIsSupported(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onTranscript]);

    const toggleListening = () => {
        if (!isSupported) {
            toast.error("Voice input is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    if (!isSupported) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className={cn(
                "rounded-full transition-all duration-300",
                isListening ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse" : "hover:bg-white/10 text-muted-foreground hover:text-white",
                className
            )}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
        >
            {isListening ? (
                <Mic className="w-5 h-5 animate-bounce" />
            ) : (
                <Mic className="w-5 h-5" />
            )}
        </Button>
    );
}
