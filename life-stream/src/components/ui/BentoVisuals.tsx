"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════
   SHARED: CSS keyframe injection (runs once)
   ════════════════════════════════════════════════════════════════ */
const INJECTED = { done: false };
function injectKeyframes() {
  if (typeof window === "undefined" || INJECTED.done) return;
  INJECTED.done = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bv-lattice-spin { from { transform: rotate3d(1, 1, 1, 0deg); } to { transform: rotate3d(1, 1, 1, 360deg); } }
    @keyframes bv-pulse-zinc { 0%,100% { fill: rgba(161,161,170,0.3); } 50% { fill: rgba(244,244,245,0.8); } }
    @keyframes bv-scanner-sweep { 0% { transform: translateY(-20%); opacity: 0; } 10% { opacity: 0.4; } 90% { opacity: 0.4; } 100% { transform: translateY(120%); opacity: 0; } }
    @keyframes bv-hex-stream { from { transform: translateY(0); } to { transform: translateY(-50%); } }
    @keyframes bv-node-firing { 0% { fill: #71717a; filter: none; } 10% { fill: #f4f4f5; filter: drop-shadow(0 0 8px #fff); } 30% { fill: #71717a; filter: none; } }
  `;
  document.head.appendChild(style);
}

/* ════════════════════════════════════════════════════════════════
   1. NEURAL CORE — Holographic AI Brain Interface
   ════════════════════════════════════════════════════════════════ */

// Geometric wireframe vertices for the brain mesh (icosphere-like)
const LATTICE_POINTS = [
  { x: 50, y: 50, z: 0 }, // core
  // Front face
  { x: 50, y: 30, z: 20 }, { x: 70, y: 45, z: 20 }, { x: 62, y: 70, z: 20 },
  { x: 38, y: 70, z: 20 }, { x: 30, y: 45, z: 20 },
  // Back face
  { x: 50, y: 20, z: -20 }, { x: 80, y: 45, z: -20 }, { x: 68, y: 80, z: -20 },
  { x: 32, y: 80, z: -20 }, { x: 20, y: 45, z: -20 },
];

const LATTICE_EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[0,5],
  [1,2],[2,3],[3,4],[4,5],[5,1],
  [1,6],[2,7],[3,8],[4,9],[5,10],
  [6,7],[7,8],[8,9],[9,10],[10,6],
];

const HEX_STREAMS = [
  "0x7F B1 D9 E0", "ACTIVE_INF", "CORE_Z_94", "LATTICE_OK", "MEM_VECT_0", "Z-OS_INF"
];

export const NeuralVisual = () => {
    const [firingNode, setFiringNode] = useState(0);

    useEffect(() => {
        injectKeyframes();
        const interval = setInterval(() => {
            setFiringNode(Math.floor(Math.random() * LATTICE_POINTS.length));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 bg-black overflow-hidden group">
            {/* Background Hex-Stream Readout (Scrolling ghost text) */}
            <div className="absolute inset-y-0 right-2 w-16 opacity-10 pointer-events-none flex flex-col font-mono text-[7px] text-zinc-500 overflow-hidden">
                <div className="flex flex-col animate-[bv-hex-stream_10s_linear_infinite]">
                    {[...HEX_STREAMS, ...HEX_STREAMS, ...HEX_STREAMS].map((s, i) => (
                        <div key={i} className="py-1 tracking-widest">{s}</div>
                    ))}
                </div>
            </div>

            {/* Tactical Grid Overlay */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                }}
            />

            {/* Laser Scanner Sweep */}
            <div className="absolute inset-x-0 h-[2px] z-10 bg-gradient-to-r from-transparent via-zinc-400 to-transparent animate-[bv-scanner-sweep_4s_ease-in-out_infinite]" />

            {/* Geometric Lattice Container — perspective field */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <motion.div 
                    className="relative w-48 h-48 flex items-center justify-center"
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <defs>
                            <radialGradient id="zinc-glow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgba(244,244,245,0.3)" />
                                <stop offset="100%" stopColor="rgba(244,244,245,0)" />
                            </radialGradient>
                        </defs>

                        {/* Central Neural Glimmer */}
                        <circle cx="50" cy="50" r="14" fill="url(#zinc-glow)" className="animate-pulse" />
                        <circle cx="50" cy="50" r="2" fill="#fff" className="animate-pulse" />

                        {/* Connection Edges */}
                        {LATTICE_EDGES.map(([a, b], idx) => (
                            <line 
                                key={idx}
                                x1={LATTICE_POINTS[a].x} y1={LATTICE_POINTS[a].y}
                                x2={LATTICE_POINTS[b].x} y2={LATTICE_POINTS[b].y}
                                stroke="rgba(161,161,170,0.15)"
                                strokeWidth="0.5"
                                className="transition-all duration-700"
                            />
                        ))}

                        {/* Nodes / Firing Synapses */}
                        {LATTICE_POINTS.map((p, idx) => (
                            <circle 
                                key={idx}
                                cx={p.x} cy={p.y}
                                r={idx === 0 ? 3 : 1.2}
                                className={cn(
                                    "transition-all duration-300",
                                    firingNode === idx ? "animate-[bv-node-firing_0.8s_ease-out_infinite]" : "fill-zinc-600"
                                )}
                            />
                        ))}

                        {/* Atomic Orbits — Silver Titanium Cage */}
                        <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="rgba(161,161,170,0.12)" strokeWidth="0.3" strokeDasharray="4 8" className="animate-[bv-spin_20s_linear_infinite]" />
                        <ellipse cx="50" cy="50" rx="12" ry="35" fill="none" stroke="rgba(161,161,170,0.12)" strokeWidth="0.3" strokeDasharray="4 8" className="animate-[bv-spin-r_15s_linear_infinite]" />
                    </svg>
                </motion.div>
            </div>

            {/* Neural HUD Labels */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-zinc-500 flex flex-col gap-1 tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse" />
                    <span>LATTICE_ENGINE_v4</span>
                </div>
                <div className="opacity-40">REAL-TIME_ANALYSIS: ACTIVE</div>
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[7px] text-zinc-700 flex items-center gap-4 tracking-widest">
                <div>THROUGHPUT: 12.4tps</div>
                <div>NODES_STABLE: {LATTICE_POINTS.length}</div>
            </div>
        </div>
    );
};


/* ════════════════════════════════════════════════════════════════
   2. DAILY SYNC — Radial Cockpit Dashboard
   ════════════════════════════════════════════════════════════════ */

// Metric ring configs
const RING_METRICS = [
  { label: "NEURAL", value: 92, maxVal: 100, r: 38, color: "52,211,153", width: 2.5 },
  { label: "FOCUS", value: 87, maxVal: 100, r: 32, color: "96,165,250", width: 2 },
  { label: "SYNC", value: 78, maxVal: 100, r: 26, color: "168,85,247", width: 1.8 },
];

// Arc path generator
const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = { x: Number((cx + r * Math.cos(startAngle)).toFixed(2)), y: Number((cy + r * Math.sin(startAngle)).toFixed(2)) };
  const end = { x: Number((cx + r * Math.cos(endAngle)).toFixed(2)), y: Number((cy + r * Math.sin(endAngle)).toFixed(2)) };
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M${start.x},${start.y} A${r},${r} 0 ${largeArc} 1 ${end.x},${end.y}`;
};

export const SyncVisual = () => {
  const [score, setScore] = useState(94);
  const [metrics, setMetrics] = useState(RING_METRICS);
  const [statusText, setStatusText] = useState("ALL SYSTEMS NOMINAL");

  useEffect(() => {
    injectKeyframes();

    const updateData = () => {
      setScore(s => {
        const delta = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
        return Math.min(100, Math.max(80, s + delta));
      });
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.min(m.maxVal, Math.max(60, m.value + [-3, -1, 0, 1, 3][Math.floor(Math.random() * 5)])),
      })));
      setStatusText(["ALL SYSTEMS NOMINAL", "COGNITIVE PEAK", "SYNC COMPLETE", "OPTIMIZING..."][Math.floor(Math.random() * 4)]);

      // Schedule next update with randomized interval (1.5s - 4s)
      timeoutId = setTimeout(updateData, 1500 + Math.random() * 2500);
    };

    let timeoutId = setTimeout(updateData, 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  const cx = 50, cy = 50;
  const startAngle = -Math.PI * 0.75;

  return (
    <div className="absolute inset-0 bg-[#030308] overflow-hidden">
      {/* Subtle radial grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 100 100">
        {[15, 25, 35, 45].map(r => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="0.15" />
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return <line key={deg} x1="50" y1="50" x2={50 + 48 * Math.cos(rad)} y2={50 + 48 * Math.sin(rad)} stroke="white" strokeWidth="0.1" />;
        })}
      </svg>

      {/* Center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.06)_0%,transparent_40%)]" />

      {/* Main radial SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="arc-glow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track rings (background) */}
        {metrics.map((m, i) => (
          <circle key={`bg-${i}`} cx={cx} cy={cy} r={m.r}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={m.width} />
        ))}

        {/* Animated progress arcs */}
        {metrics.map((m, i) => {
          const fraction = m.value / m.maxVal;
          const endAngle = startAngle + fraction * Math.PI * 1.5;
          return (
            <motion.path key={`arc-${i}`}
              d={describeArc(cx, cy, m.r, startAngle, endAngle)}
              fill="none"
              stroke={`rgba(${m.color},0.7)`}
              strokeWidth={m.width}
              strokeLinecap="round"
              filter="url(#arc-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
            />
          );
        })}

        {/* Arc end dots */}
        {metrics.map((m, i) => {
          const fraction = m.value / m.maxVal;
          const endAngle = startAngle + fraction * Math.PI * 1.5;
          const dotX = Number((cx + m.r * Math.cos(endAngle)).toFixed(2));
          const dotY = Number((cy + m.r * Math.sin(endAngle)).toFixed(2));
          return (
            <circle key={`dot-${i}`} cx={dotX} cy={dotY} r={m.width * 0.6}
              fill={`rgba(${m.color},0.9)`}
              style={{ transition: 'cx 0.8s, cy 0.8s' }}
            />
          );
        })}

        {/* Tick marks around outer ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = startAngle + (i / 24) * Math.PI * 1.5;
          const inner = 42;
          const outer = i % 4 === 0 ? 45 : 43.5;
          return (
            <line key={`tick-${i}`}
              x1={Number((cx + inner * Math.cos(angle)).toFixed(2))} y1={Number((cy + inner * Math.sin(angle)).toFixed(2))}
              x2={Number((cx + outer * Math.cos(angle)).toFixed(2))} y2={Number((cy + outer * Math.sin(angle)).toFixed(2))}
              stroke={i % 4 === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}
              strokeWidth="0.2"
            />
          );
        })}

        {/* Rotating scanner line */}
        <g style={{ transformOrigin: '50px 50px', animation: 'bv-spin 6s linear infinite' }}>
          <line x1="50" y1="50" x2="50" y2="8" stroke="rgba(52,211,153,0.08)" strokeWidth="0.3" />
          <circle cx="50" cy="12" r="0.6" fill="rgba(52,211,153,0.3)" />
        </g>
      </svg>

      {/* Center score display */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <motion.div key={score}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[32px] font-bold text-white/90 font-mono tabular-nums leading-none">
            {score}
          </motion.div>
          <div className="text-[6px] font-mono text-white/25 uppercase tracking-[0.3em] mt-1">SYSTEM SCORE</div>
          {/* Inner pulse ring */}
          <div className="absolute -inset-2 rounded-full border border-white/[0.04]"
            style={{ animation: 'bv-pulse 3s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Metric labels positioned around the arcs */}
      {metrics.map((m, i) => {
        const labelAngle = startAngle - 0.15;
        const labelX = cx + (m.r + 4) * Math.cos(labelAngle);
        const labelY = cy + (m.r + 4) * Math.sin(labelAngle);
        return (
          <div key={`label-${i}`} className="absolute pointer-events-none z-20" style={{
            left: `${labelX}%`, top: `${labelY}%`,
            transform: 'translate(-50%, -50%)',
          }}>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `rgba(${m.color},0.6)` }} />
              <span className="text-[5px] font-mono uppercase tracking-[0.15em]"
                style={{ color: `rgba(${m.color},0.5)` }}>
                {m.label} {m.value}%
              </span>
            </div>
          </div>
        );
      })}

      {/* HUD — top left */}
      <div className="absolute top-3 left-3 z-30">
        <div className="text-[7px] text-white/20 uppercase tracking-[0.25em] font-mono">Biometric Core</div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" style={{ animation: 'bv-pulse 1.2s infinite' }} />
          <span className="text-[8px] text-emerald-400/50 font-mono font-medium">{statusText}</span>
        </div>
      </div>

      {/* HUD — top right */}
      <div className="absolute top-3 right-3 z-30 text-right">
        <div className="text-[8px] text-white/20 font-mono">v2.4 · EDGE</div>
      </div>

      {/* Bottom mini bar chart */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-end justify-center gap-[2px]">
        {Array.from({ length: 20 }).map((_, i) => {
          const h = 3 + ((i * 7 + 3) % 12);
          return (
            <div key={i} className="rounded-[1px] transition-all duration-300"
              style={{
                width: 3, height: h,
                backgroundColor: `rgba(52,211,153,${0.08 + (i % 3) * 0.06})`,
              }} />
          );
        })}
      </div>
    </div>
  );
};


/* ════════════════════════════════════════════════════════════════
   3. VOICE COMMAND — Radial Audio Visualizer
   ════════════════════════════════════════════════════════════════ */

const RADIAL_BAR_COUNT = 64;
const VOICE_PHRASES = [
  "Analyzing voice pattern...",
  "Neural language processing...",
  "Extracting semantic intent...",
  "Mapping cognitive signature...",
];

export const CaptureVisual = () => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: RADIAL_BAR_COUNT }, (_, i) => {
      const center = 1 - Math.abs(i - RADIAL_BAR_COUNT / 2) / (RADIAL_BAR_COUNT / 2);
      return 0.15 + center * 0.3;
    })
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    injectKeyframes();
    // Bars animation
    const barInterval = setInterval(() => {
      setBars(prev => prev.map((_, i) => {
        const center = 1 - Math.abs(i - RADIAL_BAR_COUNT / 2) / (RADIAL_BAR_COUNT / 2);
        return 0.08 + center * (0.25 + Math.random() * 0.55) + Math.random() * 0.08;
      }));
    }, 100);

    return () => clearInterval(barInterval);
  }, []);

  // Typewriter effect for phrases
  useEffect(() => {
    const phrase = VOICE_PHRASES[phraseIndex];
    let charIndex = 0;
    setDisplayedText("");
    const typeInterval = setInterval(() => {
      if (charIndex <= phrase.length) {
        setDisplayedText(phrase.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhraseIndex(p => (p + 1) % VOICE_PHRASES.length), 1500);
      }
    }, 50);
    return () => clearInterval(typeInterval);
  }, [phraseIndex]);

  return (
    <div className="absolute inset-0 bg-[#020204] overflow-hidden">
      {/* Radial gradient center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

      {/* Expanding rings */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute rounded-full border border-white/[0.04]" style={{
          left: '50%', top: '45%',
          width: 60 + i * 50, height: 60 + i * 50,
          marginLeft: -(60 + i * 50) / 2, marginTop: -(60 + i * 50) / 2,
          animation: `bv-ring-expand ${3.5}s ease-out infinite`,
          animationDelay: `${i * 0.7}s`,
        }} />
      ))}

      {/* Radial frequency bars */}
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10">
        <svg width="200" height="200" viewBox="-100 -100 200 200">
          {bars.map((h, i) => {
            const angle = (i / RADIAL_BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
            const innerR = 28;
            const barLen = 12 + h * 35;
            const x1 = Number((Math.cos(angle) * innerR).toFixed(2));
            const y1 = Number((Math.sin(angle) * innerR).toFixed(2));
            const x2 = Number((Math.cos(angle) * (innerR + barLen)).toFixed(2));
            const y2 = Number((Math.sin(angle) * (innerR + barLen)).toFixed(2));
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={`rgba(255,255,255,${0.15 + h * 0.5})`}
                strokeWidth="1.5" strokeLinecap="round"
                style={{ transition: 'all 0.1s ease-out' }}
              />
            );
          })}
          {/* Inner ring */}
          <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          {/* Rotating dashed ring */}
          <circle cx="0" cy="0" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3"
            strokeDasharray="3 5" style={{ animation: 'bv-spin 8s linear infinite' }} />
        </svg>
      </div>

      {/* Center orb — multi-layered */}
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Outer bloom */}
        <div className="absolute -inset-6 rounded-full bg-white/[0.04] blur-xl" />
        {/* Glass ring */}
        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center"
          style={{ animation: 'bv-glow-pulse 2s ease-in-out infinite' }}>
          {/* Inner core */}
          <div className="w-4 h-4 rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.6),0_0_32px_rgba(255,255,255,0.2)]" />
        </div>
      </div>

      {/* Bottom waveform — static sine to avoid hydration mismatch */}
      <svg className="absolute bottom-12 left-0 right-0 h-8 z-10" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d={
          Array.from({ length: 100 }, (_, i) => {
            const x = i * 2;
            const center = 1 - Math.abs(i - 50) / 50;
            const y = Number((10 + Math.sin(i * 0.4) * center * 6).toFixed(2));
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
          }).join(' ')
        } fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </svg>

      {/* Voice transcript — typewriter */}
      <div className="absolute bottom-3 left-0 right-0 z-30 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <div className="flex gap-[2px]">
            {[0,1,2].map(i => (
              <div key={i} className="w-[2px] bg-white/40 rounded-full"
                style={{ height: [6, 10, 8][i], animation: `bv-radial-bar 0.5s ease-in-out infinite`, animationDelay: `${i*0.12}s`, '--bar-min': '0.4', '--bar-max': '1' } as any} />
            ))}
          </div>
          <span className="text-[9px] text-white/35 font-mono tracking-wider">
            {displayedText}<span className="animate-pulse">▋</span>
          </span>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute top-3 left-3 z-30">
        <div className="text-[7px] text-white/20 uppercase tracking-[0.25em] font-mono">Voice Engine v3.2</div>
        <div className="text-[9px] text-white/35 font-mono mt-0.5">48kHz · 24bit · Stereo</div>
      </div>
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400/90" style={{ animation: 'bv-pulse 0.7s infinite' }} />
        <span className="text-[9px] text-red-400/60 font-mono font-semibold">REC</span>
      </div>
    </div>
  );
};


/* ════════════════════════════════════════════════════════════════
   4. ZERO-KNOWLEDGE VAULT — Military Encryption Terminal
   ════════════════════════════════════════════════════════════════ */

const HEX = "0123456789ABCDEF";
const rHex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join('');

// Hexagonal tile positions
const HEX_TILES = Array.from({ length: 24 }, (_, i) => ({
  x: 12 + (i % 6) * 15 + ((Math.floor(i / 6) % 2) * 7.5),
  y: 15 + Math.floor(i / 6) * 18,
}));

export const VaultVisual = () => {
  const [hexStreams, setHexStreams] = useState<string[]>(() => [
    'A3F7B1D9E0C24856FA3B7D1E09C28A4F',
    'C8E2A6F0B3D7E1C5940FA3B7D1E09C28',
    'F1D9E0C24856FA3B7D1E09C28A4F6B0D',
    '7D1E09C28A4F6B0D3E7C15A9F2B8D4E0',
    'B5D9E2C84A6F0B3D7E1C5940FA3B7D1E',
    'E09C28A4F6B0D3E7C15A9F2B8D4E0C63',
  ]);
  const [lockState, setLockState] = useState<'locked' | 'scanning' | 'verified'>('locked');
  const [activeTiles, setActiveTiles] = useState<Set<number>>(new Set());

  useEffect(() => {
    injectKeyframes();

    // Hex stream mutation
    const hexInterval = setInterval(() => {
      setHexStreams(prev => prev.map(s => {
        const chars = s.split('');
        for (let j = 0; j < 5; j++) {
          chars[Math.floor(Math.random() * chars.length)] = HEX[Math.floor(Math.random() * 16)];
        }
        return chars.join('');
      }));
    }, 150);

    // Lock state cycle
    const lockInterval = setInterval(() => {
      setLockState(prev => prev === 'locked' ? 'scanning' : prev === 'scanning' ? 'verified' : 'locked');
    }, 2800);

    // Random tile activation
    const tileInterval = setInterval(() => {
      const newTiles = new Set<number>();
      for (let i = 0; i < 4; i++) newTiles.add(Math.floor(Math.random() * HEX_TILES.length));
      setActiveTiles(newTiles);
    }, 600);

    return () => { clearInterval(hexInterval); clearInterval(lockInterval); clearInterval(tileInterval); };
  }, []);

  const stateColor = lockState === 'verified' ? 'rgba(52,211,153,' : lockState === 'scanning' ? 'rgba(251,191,36,' : 'rgba(255,255,255,';

  return (
    <div className="absolute inset-0 bg-[#020204] overflow-hidden">
      {/* Matrix rain columns */}
      <div className="absolute inset-0 flex justify-around overflow-hidden">
        {Array.from({ length: 14 }).map((_, col) => (
          <div key={col} className="text-[6px] font-mono text-white/[0.05] leading-[9px] whitespace-nowrap select-none overflow-hidden"
            style={{ writingMode: 'vertical-lr', animation: `bv-rain ${6 + col * 0.4}s linear infinite`, animationDelay: `${col * 0.25}s` }}>
            {/* Stable hex string per column to avoid hydration mismatch */}
            {`A${col}F3B7D1E09C2${col}8A4F6B0D3E7C1${col}5A9F2B8D4E0C6${col}3A7F1B5D9E2C8${col}4A6F0B3D7E1C5`}
          </div>
        ))}
      </div>

      {/* Hexagonal tile grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
        {HEX_TILES.map((tile, i) => {
          const isActive = activeTiles.has(i);
          const hexPath = (cx: number, cy: number, r: number) => {
            const pts = [];
            for (let a = 0; a < 6; a++) {
              const angle = (Math.PI / 3) * a - Math.PI / 6;
              pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
            }
            return `M${pts.join('L')}Z`;
          };
          return (
            <path key={i} d={hexPath(tile.x, tile.y, 5)}
              fill={isActive ? `${stateColor}0.08)` : "rgba(255,255,255,0.01)"}
              stroke={isActive ? `${stateColor}0.25)` : "rgba(255,255,255,0.04)"}
              strokeWidth="0.2"
              style={{ transition: 'fill 0.3s, stroke 0.3s' }}
            />
          );
        })}
      </svg>

      {/* Central vault mechanism */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Ring 3 — outer */}
        <div className="absolute w-36 h-36 rounded-full border border-white/[0.07]"
          style={{ animation: 'bv-spin 25s linear infinite' }}>
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div key={deg} className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-white/15"
              style={{ transform: `rotate(${deg}deg) translateX(72px) translateY(-50%)` }} />
          ))}
        </div>

        {/* Ring 2 — mid */}
        <div className="absolute w-24 h-24 rounded-full border border-dashed border-white/[0.1]"
          style={{ animation: 'bv-spin-r 15s linear infinite', borderSpacing: '4px' }}>
          {[0, 90, 180, 270].map(deg => (
            <div key={deg} className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                transform: `rotate(${deg}deg) translateX(48px) translateY(-50%)`,
                backgroundColor: `${stateColor}0.4)`,
                transition: 'background-color 0.5s',
              }} />
          ))}
        </div>

        {/* Ring 1 — inner */}
        <div className="absolute w-16 h-16 rounded-full border border-white/[0.12]"
          style={{ animation: 'bv-spin 10s linear infinite' }}>
          <div className="absolute top-1/2 left-1/2 w-[3px] h-[3px] rounded-full bg-white/30"
            style={{ transform: 'rotate(0deg) translateX(32px) translateY(-50%)' }} />
        </div>

        {/* Lock core */}
        <motion.div
          className="relative z-20 w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
          animate={{
            backgroundColor: lockState === 'verified' ? 'rgba(52,211,153,0.12)' : lockState === 'scanning' ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.04)',
            borderColor: lockState === 'verified' ? 'rgba(52,211,153,0.3)' : lockState === 'scanning' ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.12)',
          }}
          style={{ border: '1px solid' }}
          transition={{ duration: 0.5 }}
        >
          {/* Lock icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className={cn("transition-colors duration-500",
              lockState === 'verified' ? "stroke-emerald-400" : lockState === 'scanning' ? "stroke-amber-400/80" : "stroke-white/50"
            )}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            {lockState === 'verified' && (
              <motion.path d="M9 16l2 2 4-4" strokeWidth="2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
            )}
          </svg>

          {/* Scan beam */}
          {lockState === 'scanning' && (
            <div className="absolute inset-x-0 h-[1px] shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              style={{ background: 'rgba(251,191,36,0.6)', animation: 'bv-scan 1.2s ease-in-out infinite' }} />
          )}
        </motion.div>

        {/* Verification burst */}
        <AnimatePresence>
          {lockState === 'verified' && (
            <motion.div className="absolute w-14 h-14 rounded-2xl border-2 border-emerald-400/40 pointer-events-none"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hex data readout — bottom */}
      <div className="absolute bottom-2 left-2 right-2 z-30 space-y-[1px]">
        {hexStreams.slice(0, 3).map((h, i) => (
          <div key={i} className="text-[6px] font-mono tracking-[0.12em] truncate"
            style={{ color: `${stateColor}${0.08 + i * 0.03})`, transition: 'color 0.5s' }}>
            0x{h}
          </div>
        ))}
      </div>

      {/* HUD — top */}
      <div className="absolute top-3 left-3 z-30">
        <div className="text-[7px] text-white/20 uppercase tracking-[0.25em] font-mono">Vault Protocol v2</div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={cn("w-1 h-1 rounded-full transition-colors duration-500",
            lockState === 'verified' ? "bg-emerald-400" : lockState === 'scanning' ? "bg-amber-400" : "bg-white/30"
          )} style={{ animation: `bv-pulse ${lockState === 'scanning' ? '0.4' : '1.2'}s infinite` }} />
          <span className={cn("text-[8px] font-mono uppercase font-semibold transition-colors duration-500",
            lockState === 'verified' ? "text-emerald-400/70" : lockState === 'scanning' ? "text-amber-400/70" : "text-white/25"
          )}>
            {lockState === 'verified' ? 'ACCESS GRANTED' : lockState === 'scanning' ? 'BIOMETRIC SCAN' : 'AES-256-GCM'}
          </span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-30 text-right">
        <div className="text-[7px] text-white/15 font-mono">SHA-256 · E2EE</div>
        <div className="text-[6px] text-white/10 font-mono mt-0.5">ZERO-KNOWLEDGE</div>
      </div>
    </div>
  );
};
