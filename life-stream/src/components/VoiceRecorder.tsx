"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    className?: string;
}

export default function VoiceRecorder({ onTranscript, className }: VoiceRecorderProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "listening" | "processing">("idle");
    const [progress, setProgress] = useState<number>(0);
    const worker = useRef<Worker | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        // Initialize Web Worker
        if (!worker.current) {
            // Use static string path to bypass Webpack bundling
            worker.current = new Worker("/worker.js", {
                type: "module",
            });

            worker.current.onmessage = (event) => {
                const { status, output, data } = event.data;

                if (status === 'loading') {
                    setStatus('loading');
                    // data contains: status: 'progress', file: '...', progress: 0-100
                    if (data.status === 'progress') {
                        setProgress(data.progress);
                    }
                    if (data.status === 'done') {
                        // Model loaded
                    }
                } else if (status === 'complete') {
                    if (output && output[0] && output[0].text) {
                        const cleanText = output[0].text.trim();
                        onTranscript(cleanText);
                        toast.success("Transcribed!");
                    } else {
                        toast.error("Could not transcribe audio.");
                    }
                    setStatus('idle');
                }
            };
        }

        return () => {
            worker.current?.terminate();
        };
    }, [onTranscript]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1
                }
            });

            // Using MediaRecorder for simplicity in this implementation
            // Note: Transformers.js usually expects raw float32 arrays.
            // But getting raw PCM from MediaRecorder is tricky without AudioWorklet.
            // Let's use a simpler approach: Record to Blob -> Send to Worker -> Worker handles it.
            // WAIT: Transformers.js pipeline expects audio URL or Float32Array. 
            // We need to decode the audio in the main thread or worker.
            // Let's rely on the worker to handle the raw audio? 
            // Actually, the simplest way for a "quick brick" is passing the audio data properly.

            // Re-think: Sending Float32Array to worker is best.

            const audioContext = new AudioContext({ sampleRate: 16000 });
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            let audioChunks: Float32Array[] = [];

            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                audioChunks.push(new Float32Array(inputData));
            };

            setStatus('listening');
            toast.info("Listening... (Speak clearly)");
            (window as any).stopAudioCapture = () => {
                source.disconnect();
                processor.disconnect();
                stream.getTracks().forEach(track => track.stop());

                // Process audio
                setStatus('processing');
                worker.current?.postMessage({
                    type: 'generate',
                    data: { audio: audioChunks, language: 'en' }
                });
            };

        } catch (error) {
            console.error("Microphone error:", error);
            toast.error("Microphone access denied");
            setStatus('idle');
        }
    };

    const stopRecording = () => {
        if ((window as any).stopAudioCapture) {
            (window as any).stopAudioCapture();
        }
    };

    return (
        <div className={cn("relative z-20", className)}>
            {/* Status: IDLE */}
            {status === 'idle' && (
                <Button
                    onClick={startRecording}
                    className="group relative px-6 py-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-500 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xs font-medium text-white/50 uppercase tracking-widest group-hover:text-purple-300 transition-colors">
                                Memory Bank
                            </span>
                            <span className="block text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                                Record Entry
                            </span>
                        </div>
                    </div>
                </Button>
            )}

            {/* Status: LISTENING */}
            {status === 'listening' && (
                <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#0a0a0a] border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium text-red-200">Listening...</span>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={stopRecording}
                        className="ml-2 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                        <Square className="w-4 h-4 fill-current" />
                    </Button>
                </div>
            )}

            {/* Status: PROCESSING */}
            {(status === 'processing' || status === 'loading') && (
                <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#0a0a0a] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Transcribing</span>
                        {progress > 0 && (
                            <span className="text-[10px] text-white/50">Loading Model... {Math.round(progress)}%</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
