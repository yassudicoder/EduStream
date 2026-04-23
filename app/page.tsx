"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { Search, Sparkles, BookOpen, Lightbulb, Tag, Cpu } from "lucide-react";
import SimulationCard from "./components/SimulationCard";

type Level = "toddler" | "student" | "expert";

interface ExplainResult {
  concept: string;
  level: string;
  explanation: string;
  analogy: string;
  key_terms: string[];
  visual_prompt: string;
  simulation: string;
  powered_by: "gemini" | "local";
}

const LEVELS: { id: Level; label: string; emoji: string }[] = [
  { id: "toddler", label: "Toddler", emoji: "🧸" },
  { id: "student", label: "Student", emoji: "📚" },
  { id: "expert", label: "Expert", emoji: "🔬" },
];

const EASE: Easing = "easeOut";

function cardAnim(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
    transition: { delay: i * 0.1, duration: 0.4, ease: EASE },
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level>("student");
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept: query, level }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-12 md:py-20 max-w-4xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm text-violet-300">
            <Sparkles size={14} />
            <span>EduStream — ELI5 Engine</span>
          </div>
          {result && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              result.powered_by === "gemini"
                ? "bg-blue-500/20 border border-blue-400/30 text-blue-300"
                : "bg-white/10 border border-white/20 text-white/50"
            }`}>
              <Cpu size={11} />
              {result.powered_by === "gemini" ? "Powered by Gemini AI" : "Local Knowledge Base"}
            </div>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Understand{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Anything
          </span>
        </h1>
        <p className="text-white/50 text-base md:text-lg max-w-md">
          Type any concept and get a crystal-clear explanation tailored to your level.
        </p>
      </motion.div>

      {/* Hero Search */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <div className="glow-border glass rounded-2xl flex items-center gap-3 px-5 py-4 transition-all duration-300">
          <Search size={20} className="text-white/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Quantum Entanglement, Black Holes, DNA..."
            className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors duration-200 shrink-0"
          >
            {loading ? "Thinking..." : "Explain"}
          </button>
        </div>

        {/* Level Toggle */}
        <div className="glass rounded-2xl p-1.5 flex gap-1 self-center">
          {LEVELS.map(({ id, label, emoji }) => (
            <button
              key={id}
              type="button"
              onClick={() => setLevel(id)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                level === id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </motion.form>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Explanation */}
            <motion.div
              {...cardAnim(0)}
              className="glass rounded-2xl p-6 flex flex-col gap-3 md:col-span-2"
            >
              <div className="flex items-center gap-2 text-violet-300">
                <BookOpen size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Simple Explanation</span>
              </div>
              <p className="text-white/90 text-base leading-relaxed">{result.explanation}</p>
            </motion.div>

            {/* Analogy */}
            <motion.div
              {...cardAnim(1)}
              className="glass rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-blue-300">
                <Lightbulb size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Real-life Analogy</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{result.analogy}</p>
            </motion.div>

            {/* Key Terms */}
            <motion.div
              {...cardAnim(2)}
              className="glass rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-emerald-300">
                <Tag size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Key Terms</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.key_terms.map((term) => (
                  <span
                    key={term}
                    className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs px-3 py-1 rounded-full"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Simulation */}
            <motion.div
              {...cardAnim(3)}
              className="md:col-span-2"
            >
              <SimulationCard simulation={result.simulation as "atom" | "gravity" | "blackhole" | "dna" | "wave" | "neural" | "quantum"} concept={result.concept} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/25 text-sm"
        >
          Search for any concept above to get started ✨
        </motion.p>
      )}
    </main>
  );
}
