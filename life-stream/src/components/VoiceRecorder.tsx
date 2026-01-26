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

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Clone the data because inputBuffer is reused
                audioChunks.push(new Float32Array(inputData));
            };

            setStatus('listening');
            toast.info("Listening... (Speak clearly)");

            // Store ref to stop later
            (window as any).stopAudioCapture = () => {
                source.disconnect();
                processor.disconnect();
                stream.getTracks().forEach(track => track.stop());
                audioContext.close();

                // Merge chunks
                const length = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const merged = new Float32Array(length);
                let offset = 0;
                for (const chunk of audioChunks) {
                    merged.set(chunk, offset);
                    offset += chunk.length;
                }

                setStatus('processing');
                toast.info("Processing with AI...", { duration: 2000 });
                worker.current?.postMessage({ audio: merged });
            };

        } catch (err) {
            console.error(err);
            toast.error("Microphone access denied.");
            setStatus('idle');
        }
    };

    const stopRecording = () => {
        if ((window as any).stopAudioCapture) {
            (window as any).stopAudioCapture();
        }
    };

    return (
        <div className={cn("relative flex items-center gap-2", className)}>
            {status === 'loading' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 bg-background/80 backdrop-blur-md text-xs border rounded p-1 shadow-lg">
                    <div className="flex justify-between mb-1">
                        <span>Downloading Brain...</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            <Button
                variant="ghost"
                size="icon"
                onClick={status === 'listening' ? stopRecording : startRecording}
                disabled={status === 'processing' || status === 'loading'}
                className={cn(
                    "rounded-full transition-all duration-300 w-10 h-10",
                    status === 'listening' ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse" :
                        status === 'processing' ? "bg-blue-500/20 text-blue-400 animate-spin" :
                            "hover:bg-white/10 text-muted-foreground hover:text-white"
                )}
                title={status === 'listening' ? "Stop (Process)" : "Start AI Voice"}
            >
                {status === 'listening' ? (
                    <Square className="w-4 h-4 fill-current" />
                ) : status === 'processing' || status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </Button>
        </div>
    );
}
