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
    @keyframes bv-spin { to { transform: rotate(360deg); } }
    @keyframes bv-spin-r { to { transform: rotate(-360deg); } }
    @keyframes bv-pulse { 0%,100% { opacity:0.3; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
    @keyframes bv-sweep { from { left:0%; } to { left:100%; } }
    @keyframes bv-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    @keyframes bv-glow-pulse { 0%,100% { box-shadow:0 0 8px rgba(255,255,255,0.15); } 50% { box-shadow:0 0 24px rgba(255,255,255,0.35); } }
    @keyframes bv-rain { from { transform:translateY(-100%); } to { transform:translateY(100%); } }
    @keyframes bv-ring-expand { from { transform:translate(-50%,-50%) scale(0.3); opacity:0.6; } to { transform:translate(-50%,-50%) scale(1.8); opacity:0; } }
    @keyframes bv-scan { 0%,100% { top:15%; } 50% { top:85%; } }
    @keyframes bv-ecg-sweep { from { left:-2%; } to { left:102%; } }
    @keyframes bv-dash { to { stroke-dashoffset: -20; } }
    @keyframes bv-orbit { to { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); } }
    @keyframes bv-signal { 0% { offset-distance:0%; opacity:0; } 15% { opacity:1; } 85% { opacity:1; } 100% { offset-distance:100%; opacity:0; } }
    @keyframes bv-typewriter { from { width:0; } to { width:100%; } }
    @keyframes bv-radial-bar { 0%,100% { transform:scaleY(var(--bar-min)); } 50% { transform:scaleY(var(--bar-max)); } }
    @keyframes bv-hex-flash { 0%,100% { opacity:0.03; } 50% { opacity:0.15; } }
    @keyframes bv-verified-burst { 0% { transform:translate(-50%,-50%) scale(0); opacity:1; } 100% { transform:translate(-50%,-50%) scale(3); opacity:0; } }
  `;
  document.head.appendChild(style);
}

/* ════════════════════════════════════════════════════════════════
   1. NEURAL CORE — Holographic AI Brain Interface
   ════════════════════════════════════════════════════════════════ */

// Geometric wireframe vertices for the brain mesh (icosphere-like)
const MESH_POINTS = [
  { x: 50, y: 50 }, // center
  // Inner hexagon
  { x: 50, y: 32 }, { x: 65, y: 41 }, { x: 65, y: 59 },
  { x: 50, y: 68 }, { x: 35, y: 59 }, { x: 35, y: 41 },
  // Outer hexagon
  { x: 50, y: 18 }, { x: 72, y: 28 }, { x: 80, y: 50 },
  { x: 72, y: 72 }, { x: 50, y: 82 }, { x: 28, y: 72 },
  { x: 20, y: 50 }, { x: 28, y: 28 },
];

// Mesh connections (inner hex + outer hex + cross connections)
const MESH_EDGES: [number, number][] = [
  // Center to inner
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
  // Inner ring
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
  // Inner to outer
  [1,7],[1,8],[2,8],[2,9],[3,9],[3,10],[4,10],[4,11],[5,11],[5,12],[6,12],[6,13],[1,14],[6,14],[1,7],
  // Outer ring
  [7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,7],
];

// Data labels that orbit around the core
const DATA_LABELS = [
  { text: "PATTERN", angle: 0, r: 42 },
  { text: "MEMORY", angle: 72, r: 40 },
  { text: "SYNAPSE", angle: 144, r: 43 },
  { text: "CORTEX", angle: 216, r: 41 },
  { text: "SIGNAL", angle: 288, r: 42 },
];

export const NeuralVisual = () => {
  const [activeEdge, setActiveEdge] = useState(0);
  const [pulseRing, setPulseRing] = useState(0);

  useEffect(() => {
    injectKeyframes();
    // Cycle through edge groups for the "thinking" effect
    const edgeInterval = setInterval(() => {
      setActiveEdge(e => (e + 1) % 5);
    }, 1800);
    // Pulse rings emanating from center
    const pulseInterval = setInterval(() => {
      setPulseRing(p => (p + 1) % 100);
    }, 3000);
    return () => { clearInterval(edgeInterval); clearInterval(pulseInterval); };
  }, []);

  // Determine which edges are "active" based on current group
  const activeEdges = useMemo(() => {
    const groupSize = Math.ceil(MESH_EDGES.length / 5);
    const start = activeEdge * groupSize;
    return new Set(MESH_EDGES.slice(start, start + groupSize).map((_, i) => start + i));
  }, [activeEdge]);

  return (
    <div className="absolute inset-0 bg-[#030308] overflow-hidden">
      {/* Hexagonal grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 100 100">
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const cx = 10 + col * 16 + (row % 2) * 8;
            const cy = 8 + row * 12;
            const r = 5;
            const pts = Array.from({ length: 6 }, (_, a) => {
              const angle = (Math.PI / 3) * a - Math.PI / 6;
              return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
            });
            return <polygon key={`${row}-${col}`} points={pts.join(' ')} fill="none" stroke="white" strokeWidth="0.15" />;
          })
        )}
      </svg>

      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(120,140,255,0.08)_0%,transparent_50%)]" />

      {/* Energy pulse rings */}
      {[0, 1, 2].map(i => (
        <div key={`pulse-${i}`} className="absolute left-1/2 top-1/2 rounded-full border pointer-events-none"
          style={{
            width: 80, height: 80, marginLeft: -40, marginTop: -40,
            borderColor: 'rgba(140,160,255,0.12)',
            animation: `bv-ring-expand 4s ease-out infinite`,
            animationDelay: `${i * 1.3}s`,
          }} />
      ))}

      {/* Main wireframe mesh */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="edge-glow">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="core-grad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(180,190,255,0.3)" />
            <stop offset="100%" stopColor="rgba(180,190,255,0)" />
          </radialGradient>
        </defs>

        {/* Core glow circle */}
        <circle cx="50" cy="50" r="12" fill="url(#core-grad)" />

        {/* Mesh edges */}
        {MESH_EDGES.map(([a, b], i) => {
          const pa = MESH_POINTS[a], pb = MESH_POINTS[b];
          const isActive = activeEdges.has(i);
          return (
            <line key={`e-${i}`}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={isActive ? "rgba(160,175,255,0.5)" : "rgba(255,255,255,0.08)"}
              strokeWidth={isActive ? 0.4 : 0.15}
              filter={isActive ? "url(#edge-glow)" : undefined}
              style={{ transition: "stroke 0.8s, stroke-width 0.8s" }}
            />
          );
        })}

        {/* Mesh vertices */}
        {MESH_POINTS.map((p, i) => (
          <g key={`v-${i}`}>
            <circle cx={p.x} cy={p.y} r={i === 0 ? 2.5 : i <= 6 ? 1.2 : 0.7}
              fill={i === 0 ? "rgba(200,210,255,0.9)" : "rgba(255,255,255,0.5)"}
              style={{ transition: "fill 0.5s" }} />
            {i === 0 && (
              <circle cx={p.x} cy={p.y} r="4" fill="none" stroke="rgba(160,175,255,0.2)" strokeWidth="0.3"
                style={{ animation: 'bv-pulse 2.5s ease-in-out infinite' }} />
            )}
          </g>
        ))}

        {/* 3 concentric rotating rings — atom style */}
        <g style={{ transformOrigin: '50px 50px', animation: 'bv-spin 12s linear infinite' }}>
          <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke="rgba(140,160,255,0.12)" strokeWidth="0.25"
            strokeDasharray="2 4" />
          <circle cx="80" cy="50" r="1.2" fill="rgba(160,180,255,0.7)" />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'bv-spin-r 18s linear infinite' }}>
          <ellipse cx="50" cy="50" rx="10" ry="30" fill="none" stroke="rgba(140,160,255,0.08)" strokeWidth="0.2"
            strokeDasharray="1.5 3" />
          <circle cx="50" cy="20" r="1" fill="rgba(160,180,255,0.5)" />
        </g>
        <g style={{ transformOrigin: '50px 50px', animation: 'bv-spin 25s linear infinite', transform: 'rotate(60deg)' }}>
          <ellipse cx="50" cy="50" rx="28" ry="8" fill="none" stroke="rgba(140,160,255,0.06)" strokeWidth="0.2"
            strokeDasharray="3 5" />
          <circle cx="78" cy="50" r="0.8" fill="rgba(160,180,255,0.4)" />
        </g>

        {/* Signal pulse traveling from center outward */}
        <circle r="0.8" fill="rgba(180,200,255,0.8)" filter="url(#edge-glow)">
          <animateMotion dur="3s" repeatCount="indefinite"
            path={`M50,50 L${MESH_POINTS[1].x},${MESH_POINTS[1].y} L${MESH_POINTS[7].x},${MESH_POINTS[7].y}`} />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="0.6" fill="rgba(180,200,255,0.6)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1s"
            path={`M50,50 L${MESH_POINTS[3].x},${MESH_POINTS[3].y} L${MESH_POINTS[10].x},${MESH_POINTS[10].y}`} />
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle r="0.5" fill="rgba(180,200,255,0.5)">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="2s"
            path={`M50,50 L${MESH_POINTS[5].x},${MESH_POINTS[5].y} L${MESH_POINTS[12].x},${MESH_POINTS[12].y}`} />
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="3.5s" repeatCount="indefinite" begin="2s" />
        </circle>
      </svg>

      {/* Floating data labels */}
      {DATA_LABELS.map((label, i) => {
        const rad = (label.angle * Math.PI) / 180;
        const x = 50 + label.r * Math.cos(rad);
        const y = 50 + label.r * Math.sin(rad);
        return (
          <div key={`dl-${i}`} className="absolute pointer-events-none" style={{
            left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            animation: `bv-float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}>
            <div className="text-[5px] font-mono text-white/15 uppercase tracking-[0.2em] whitespace-nowrap">
              {label.text}
            </div>
          </div>
        );
      })}

      {/* HUD */}
      <div className="absolute top-3 left-3 z-30 space-y-1">
        <div className="text-[7px] text-white/20 uppercase tracking-[0.25em] font-mono">AI Core v4.2</div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8CA0FF]/60" style={{ animation: 'bv-pulse 1.5s infinite' }} />
          <span className="text-[8px] text-[#8CA0FF]/40 font-mono">INFERENCE ACTIVE</span>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 z-30">
        <div className="text-[6px] text-white/10 font-mono tracking-wider">
          MESH {MESH_POINTS.length} · EDGES {MESH_EDGES.length}
        </div>
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
    const dataInterval = setInterval(() => {
      setScore(s => {
        const delta = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)];
        return Math.min(100, Math.max(80, s + delta));
      });
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.min(m.maxVal, Math.max(60, m.value + [-3, -1, 0, 1, 3][Math.floor(Math.random() * 5)])),
      })));
      setStatusText(["ALL SYSTEMS NOMINAL", "COGNITIVE PEAK", "SYNC COMPLETE", "OPTIMIZING..."][Math.floor(Math.random() * 4)]);
    }, 2500);
    return () => clearInterval(dataInterval);
  }, []);

  const cx = 50, cy = 50;
  const startAngle = -Math.PI * 0.75;

  return (
    <div className="absolute inset-0 bg-[#030308] overflow-hidden">
      {/* Subtle radial grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" viewBox="0 0 100 100">
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
