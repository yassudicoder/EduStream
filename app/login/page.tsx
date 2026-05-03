"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { motion } from "framer-motion";
import { Sparkles, Zap, Trophy, User, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useGameStore((s) => s.login);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      login(name.trim(), email.trim());
      router.push("/dashboard");
    }, 600);
  }

  const features = [
    { icon: "🎮", label: "Gamified Learning" },
    { icon: "🏆", label: "Leaderboard" },
    { icon: "⚔️", label: "Battle Arena" },
    { icon: "👾", label: "Avatar & Skins" },
    { icon: "🔥", label: "Daily Streaks" },
    { icon: "💎", label: "Achievements" },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
                Edu<span className="grad-text">Stream</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: "var(--text)" }}>
              Learn to Code.<br />
              <span className="grad-text">Level Up.</span>
            </h1>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
              Master HTML, CSS, JavaScript and more through gamified lessons, battles, and real challenges.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {features.map(f => (
              <div key={f.label} className="glass card-shine rounded-xl px-3 py-2.5 flex items-center gap-2">
                <span className="text-lg">{f.icon}</span>
                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass card-shine rounded-3xl p-8 flex flex-col gap-6"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
            <div>
              <h2 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Start Your Journey</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>No password needed — just your name and email.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Your Name</label>
                <div className="glow-border glass rounded-xl flex items-center gap-3 px-4 py-3">
                  <User size={15} style={{ color: "var(--text-faint)" }} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: "var(--text)" }}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Email Address</label>
                <div className="glow-border glass rounded-xl flex items-center gap-3 px-4 py-3">
                  <Mail size={15} style={{ color: "var(--text-faint)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: "var(--text)" }}
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                style={{ background: "var(--btn-grad)", boxShadow: "0 8px 32px var(--accent-glow)" }}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Starting...</>
                  : <><Zap size={16} /> Start Learning <ArrowRight size={14} /></>
                }
              </motion.button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>or continue as</span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            {/* Quick demo accounts */}
            <div className="grid grid-cols-2 gap-2">
              {[{ name: "CodeNinja", email: "ninja@demo.com" }, { name: "ByteWizard", email: "wizard@demo.com" }].map(d => (
                <button key={d.name}
                  onClick={() => { setName(d.name); setEmail(d.email); }}
                  className="glass rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-105"
                  style={{ color: "var(--text-muted)" }}
                >
                  👤 {d.name}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-center" style={{ color: "var(--text-faint)" }}>
              Your progress is saved locally. No account required.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
