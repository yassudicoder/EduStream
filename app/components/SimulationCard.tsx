"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Atom, Zap } from "lucide-react";

type SimType = "atom" | "gravity" | "blackhole" | "dna" | "wave" | "neural" | "quantum";

interface Props {
  simulation?: SimType;
  concept?: string;
}

// --- Individual simulations ---

function AtomSim({ v }: { v: number }) {
  const scale = 0.5 + (v / 100) * 1.0;
  const speed = 2.5 - (v / 100) * 2.0;
  const hue = 200 + Math.round((v / 100) * 160);
  const orbits = [1, 0.65, 0.4];
  return (
    <>
      {orbits.map((r, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/15"
          style={{ width: 130 * r * scale, height: 130 * r * scale }} />
      ))}
      {orbits.map((r, i) => (
        <motion.div key={`e${i}`} className="absolute w-2.5 h-2.5 rounded-full"
          style={{ background: `hsl(${hue + i * 30}, 80%, 65%)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: speed * (1 + i * 0.4), repeat: Infinity, ease: "linear" }}
          transformTemplate={({ rotate }) => `rotate(${rotate}) translateX(${55 * r * scale}px)`}
        />
      ))}
      <motion.div className="rounded-full z-10"
        style={{ width: 22 * scale, height: 22 * scale, background: `hsl(${hue}, 70%, 60%)`, boxShadow: `0 0 ${18 * scale}px hsl(${hue}, 70%, 60%)` }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function GravitySim({ v }: { v: number }) {
  const mass = 0.4 + (v / 100) * 1.2;
  const numLines = 8;
  return (
    <>
      {/* Planet */}
      <motion.div className="absolute rounded-full z-10"
        style={{ width: 36 * mass, height: 36 * mass, background: "radial-gradient(circle at 35% 35%, #818cf8, #4f46e5)", boxShadow: `0 0 ${30 * mass}px #6366f180` }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Field lines */}
      {Array.from({ length: numLines }).map((_, i) => {
        const angle = (i / numLines) * 360;
        const len = 40 + mass * 30;
        return (
          <motion.div key={i} className="absolute origin-center"
            style={{ width: 2, height: len, background: "linear-gradient(to bottom, transparent, #818cf840)", borderRadius: 4, rotate: angle, translateY: -(18 * mass + len / 2) }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        );
      })}
      {/* Orbiting moon */}
      <motion.div className="absolute w-3 h-3 rounded-full bg-blue-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 4 - mass, repeat: Infinity, ease: "linear" }}
        transformTemplate={({ rotate }) => `rotate(${rotate}) translateX(${70 * mass}px)`}
      />
    </>
  );
}

function BlackholeSim({ v }: { v: number }) {
  const pull = 0.4 + (v / 100) * 1.2;
  const rings = [1, 0.75, 0.55];
  return (
    <>
      {/* Accretion disk rings */}
      {rings.map((r, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 140 * r * pull, height: 50 * r * pull, border: `2px solid hsl(${30 + i * 20}, 90%, ${60 - i * 10}%)`, opacity: 0.6 - i * 0.1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: "linear", repeatType: i % 2 === 0 ? "loop" : "reverse" }}
        />
      ))}
      {/* Event horizon */}
      <div className="absolute rounded-full z-10"
        style={{ width: 32 * pull, height: 32 * pull, background: "#000", boxShadow: `0 0 ${40 * pull}px #7c3aed80, 0 0 ${20 * pull}px #000` }}
      />
      {/* Light bending arc */}
      <motion.div className="absolute rounded-full border-2 border-yellow-300/30"
        style={{ width: 160 * pull, height: 160 * pull }}
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}

function DNASim({ v }: { v: number }) {
  const speed = 3 - (v / 100) * 2.5;
  const stretch = 0.6 + (v / 100) * 0.8;
  const pairs = 7;
  const bases = ["#f472b6", "#34d399", "#60a5fa", "#fbbf24"];
  return (
    <motion.div className="relative flex items-center justify-center w-full h-full"
      animate={{ rotateY: 360 }}
      transition={{ duration: speed * 4, repeat: Infinity, ease: "linear" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {Array.from({ length: pairs }).map((_, i) => {
        const y = (i / (pairs - 1) - 0.5) * 120 * stretch;
        const angle = (i / pairs) * Math.PI * 2;
        const x1 = Math.cos(angle) * 40;
        const x2 = Math.cos(angle + Math.PI) * 40;
        const color = bases[i % bases.length];
        return (
          <div key={i} className="absolute flex items-center" style={{ top: `calc(50% + ${y}px)`, left: "50%", transform: "translateX(-50%)" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}`, marginLeft: x1 }} />
            <div className="h-px flex-1 mx-1" style={{ background: `${color}60`, width: 30 }} />
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}`, marginLeft: x2 }} />
          </div>
        );
      })}
    </motion.div>
  );
}

function WaveSim({ v }: { v: number }) {
  const freq = 1 + (v / 100) * 4;
  const amp = 20 + (v / 100) * 30;
  const points = 60;
  const width = 280;

  return (
    <motion.svg width={width} height={100} viewBox={`0 0 ${width} 100`}>
      <motion.path
        stroke="url(#waveGrad)"
        strokeWidth={2.5}
        fill="none"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 0, repeat: 0 }}
        d={Array.from({ length: points }, (_, i) => {
          const x = (i / (points - 1)) * width;
          const y = 50 + amp * Math.sin((i / points) * Math.PI * 2 * freq);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ")}
      />
      <motion.path
        stroke="url(#waveGrad2)"
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
        d={Array.from({ length: points }, (_, i) => {
          const x = (i / (points - 1)) * width;
          const y = 50 + amp * 0.5 * Math.sin((i / points) * Math.PI * 2 * freq * 1.5 + 1);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ")}
      />
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

function NeuralSim({ v }: { v: number }) {
  const layers = [[3, 4, 4, 2]];
  const activity = v / 100;
  const allLayers = layers[0];
  const maxNodes = Math.max(...allLayers);
  const W = 240, H = 140;
  const layerX = allLayers.map((_, i) => (i / (allLayers.length - 1)) * W + 20);

  const nodes: { x: number; y: number; layer: number; idx: number }[] = [];
  allLayers.forEach((count, li) => {
    for (let ni = 0; ni < count; ni++) {
      nodes.push({ x: layerX[li], y: ((ni + 0.5) / count) * H + 10, layer: li, idx: ni });
    }
  });

  return (
    <svg width={W + 40} height={H + 20} viewBox={`0 0 ${W + 40} ${H + 20}`}>
      {/* Connections */}
      {nodes.filter(n => n.layer < allLayers.length - 1).map(n =>
        nodes.filter(m => m.layer === n.layer + 1).map(m => (
          <line key={`${n.layer}-${n.idx}-${m.idx}`}
            x1={n.x} y1={n.y} x2={m.x} y2={m.y}
            stroke={`rgba(129,140,248,${0.1 + activity * 0.4})`} strokeWidth={0.8}
          />
        ))
      )}
      {/* Nodes */}
      {nodes.map(n => {
        const hue = 220 + n.layer * 40;
        const glow = activity * 12;
        return (
          <motion.circle key={`${n.layer}-${n.idx}`}
            cx={n.x} cy={n.y} r={5 + activity * 3}
            fill={`hsl(${hue}, 70%, 60%)`}
            animate={{ r: [5 + activity * 2, 5 + activity * 4, 5 + activity * 2] }}
            transition={{ duration: 1.2 + n.idx * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 ${glow}px hsl(${hue}, 70%, 60%))` }}
          />
        );
      })}
    </svg>
  );
}

function QuantumSim({ v }: { v: number }) {
  const entangle = v / 100;
  const dist = 60 + entangle * 30;
  const hue1 = 260, hue2 = 160;
  return (
    <>
      {/* Connection beam */}
      <motion.div className="absolute h-px"
        style={{ width: dist * 2, background: `linear-gradient(to right, hsl(${hue1},80%,65%), hsl(${hue2},80%,65%))`, opacity: 0.4 + entangle * 0.5 }}
        animate={{ scaleX: [1, 1.05, 1], opacity: [0.3 + entangle * 0.4, 0.7, 0.3 + entangle * 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Particle 1 */}
      <motion.div className="absolute rounded-full"
        style={{ width: 20, height: 20, background: `hsl(${hue1}, 80%, 65%)`, boxShadow: `0 0 ${16 + entangle * 20}px hsl(${hue1}, 80%, 65%)`, left: `calc(50% - ${dist}px)` }}
        animate={{ scale: [1, 1.2, 1], x: [0, -entangle * 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Particle 2 */}
      <motion.div className="absolute rounded-full"
        style={{ width: 20, height: 20, background: `hsl(${hue2}, 80%, 65%)`, boxShadow: `0 0 ${16 + entangle * 20}px hsl(${hue2}, 80%, 65%)`, left: `calc(50% + ${dist - 20}px)` }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, entangle * 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Superposition rings */}
      {[1, 1.6].map((r, i) => (
        <motion.div key={i} className="absolute rounded-full border border-violet-400/30"
          style={{ width: 50 * r, height: 50 * r, left: `calc(50% - ${dist - 5}px)` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </>
  );
}

const simLabels: Record<SimType, { title: string; low: string; high: string }> = {
  atom:     { title: "Atomic Model",         low: "Ground State",    high: "Excited State"   },
  gravity:  { title: "Gravitational Field",  low: "Low Mass",        high: "High Mass"        },
  blackhole:{ title: "Black Hole",           low: "Weak Pull",       high: "Strong Pull"      },
  dna:      { title: "DNA Double Helix",     low: "Relaxed",         high: "Supercoiled"      },
  wave:     { title: "Wave Interference",    low: "Low Frequency",   high: "High Frequency"   },
  neural:   { title: "Neural Network",       low: "Low Activity",    high: "High Activity"    },
  quantum:  { title: "Quantum Entanglement", low: "Weak Entangle",   high: "Strong Entangle"  },
};

export default function SimulationCard({ simulation = "atom", concept }: Props) {
  const [value, setValue] = useState(50);
  const sim = (simulation in simLabels ? simulation : "atom") as SimType;
  const label = simLabels[sim];

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/80">
          <Atom size={18} />
          <span className="text-sm font-semibold uppercase tracking-wider">Interactive Sandbox</span>
        </div>
        <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full">
          <Zap size={12} className="text-violet-400" />
          <span className="text-xs text-violet-300 font-medium">{label.title}</span>
        </div>
      </div>

      {/* Stage */}
      <div className="flex items-center justify-center h-48 rounded-xl bg-white/5 overflow-hidden relative">
        {sim === "atom"      && <AtomSim v={value} />}
        {sim === "gravity"   && <GravitySim v={value} />}
        {sim === "blackhole" && <BlackholeSim v={value} />}
        {sim === "dna"       && <DNASim v={value} />}
        {sim === "wave"      && <WaveSim v={value} />}
        {sim === "neural"    && <NeuralSim v={value} />}
        {sim === "quantum"   && <QuantumSim v={value} />}
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-white/50">
          <span>{label.low}</span>
          <span className="text-white/70 font-medium">{value}%</span>
          <span>{label.high}</span>
        </div>
        <input type="range" min={0} max={100} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {concept && (
        <p className="text-xs text-white/30 text-center">
          Simulation for: <span className="text-white/50 font-medium">{concept}</span>
        </p>
      )}
    </div>
  );
}
